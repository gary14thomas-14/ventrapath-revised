function mapProjectRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    rawIdea: row.raw_idea,
    country: row.country,
    region: row.region,
    currencyCode: row.currency_code,
    hoursPerWeek: row.hours_per_week,
    status: row.status,
    currentPhaseNumber: row.current_phase_number,
    latestBlueprintVersionNumber: row.latest_blueprint_version_number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapBlueprintRow(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    version: row.version_number,
    status: row.status,
    sections: {
      business: row.business_md,
      market: row.market_md,
      monetisation: row.monetisation_md,
      execution: row.execution_md,
      legal: row.legal_md,
      website: row.website_md,
      risks: row.risks_md,
    },
    meta: {
      country: row.country,
      region: row.region,
      currencyCode: row.currency_code,
      generatedAt: row.created_at,
    },
    createdAt: row.created_at,
  };
}

function mapAgentOutputCacheRow(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    phaseNumber: row.phase_number,
    stepKey: row.step_key,
    agentId: row.agent_id,
    taskKind: row.task_kind,
    cacheKey: row.cache_key,
    model: row.model,
    promptVersionHash: row.prompt_version_hash,
    normalizedInputHash: row.normalized_input_hash,
    dependencyHash: row.dependency_hash,
    status: row.status,
    outputJson: row.output_json,
    sourceMetaJson: row.source_meta_json,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
  };
}

function mapPhaseInstanceRow(row) {
  return {
    id: row.id,
    projectId: row.project_id,
    phaseNumber: row.phase_number,
    title: row.title,
    state: row.state,
    summary: row.summary,
    generatedContent: row.generated_content,
    userState: row.user_state ?? {},
    progress: row.progress ?? {},
    tasks: row.tasks,
    latestRunId: row.latest_run_id,
    generatedAt: row.generated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createPostgresProjectStore(env) {
  if (!env.databaseUrl) {
    throw new Error('PERSISTENCE_DRIVER=postgres requires DATABASE_URL');
  }

  let poolPromise;

  async function getPool() {
    if (!poolPromise) {
      poolPromise = (async () => {
        let pg;

        try {
          pg = await import('pg');
        } catch {
          throw new Error('Postgres driver not installed. Run `npm install pg` in projects/VentraPath/backend and set PERSISTENCE_DRIVER=postgres.');
        }

        const { Pool } = pg;
        return new Pool({ connectionString: env.databaseUrl });
      })();
    }

    return poolPromise;
  }

  async function getOwnedProject(projectId, userId) {
    const pool = await getPool();
    const result = await pool.query(
      `
        select *
        from projects
        where id = $1 and user_id = $2
        limit 1
      `,
      [projectId, userId],
    );

    return result.rows[0] ?? null;
  }

  async function ensureUserExists(userId) {
    const pool = await getPool();
    await pool.query(
      `
        insert into users (id, email, name, auth_provider, auth_provider_user_id)
        values ($1, $2, $3, $4, $5)
        on conflict (id) do nothing
      `,
      [
        userId,
        `dev+${userId}@ventrapath.local`,
        'Dev User',
        'dev',
        userId,
      ],
    );
  }

  return {
    async listProjectsForUser(userId) {
      await ensureUserExists(userId);
      const pool = await getPool();
      const result = await pool.query(
        `
          select *
          from projects
          where user_id = $1
          order by updated_at desc
        `,
        [userId],
      );

      return result.rows.map(mapProjectRow);
    },

    async createProject(project) {
      await ensureUserExists(project.userId);
      const pool = await getPool();
      const result = await pool.query(
        `
          insert into projects (
            id,
            user_id,
            name,
            raw_idea,
            country,
            region,
            currency_code,
            hours_per_week,
            status,
            current_phase_number,
            latest_blueprint_version_number,
            created_at,
            updated_at
          ) values (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
          )
          returning *
        `,
        [
          project.id,
          project.userId,
          project.name,
          project.rawIdea,
          project.country,
          project.region,
          project.currencyCode,
          project.hoursPerWeek,
          project.status,
          project.currentPhaseNumber,
          project.latestBlueprintVersionNumber,
          project.createdAt,
          project.updatedAt,
        ],
      );

      return mapProjectRow(result.rows[0]);
    },

    async getProjectByIdForUser(projectId, userId) {
      await ensureUserExists(userId);
      const row = await getOwnedProject(projectId, userId);
      return row ? mapProjectRow(row) : null;
    },

    async createBlueprintVersionForProject(projectId, userId, sections) {
      await ensureUserExists(userId);
      const pool = await getPool();
      const client = await pool.connect();

      try {
        await client.query('begin');

        const projectResult = await client.query(
          `
            select *
            from projects
            where id = $1 and user_id = $2
            limit 1
          `,
          [projectId, userId],
        );

        const project = projectResult.rows[0];

        if (!project) {
          await client.query('rollback');
          return null;
        }

        const versionResult = await client.query(
          `
            select coalesce(max(version_number), 0) + 1 as next_version
            from blueprint_versions
            where project_id = $1
          `,
          [projectId],
        );

        const nextVersion = Number(versionResult.rows[0].next_version);

        const insertResult = await client.query(
          `
            insert into blueprint_versions (
              project_id,
              version_number,
              status,
              business_md,
              market_md,
              monetisation_md,
              execution_md,
              legal_md,
              website_md,
              risks_md,
              country,
              region,
              currency_code,
              created_by_run_id
            ) values (
              $1, $2, 'ready', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, null
            )
            returning *
          `,
          [
            projectId,
            nextVersion,
            sections.business,
            sections.market,
            sections.monetisation,
            sections.execution,
            sections.legal,
            sections.website,
            sections.risks,
            project.country,
            project.region,
            project.currency_code,
          ],
        );

        await client.query(
          `
            update projects
            set status = 'blueprint_ready',
                latest_blueprint_version_number = $2,
                updated_at = now()
            where id = $1
          `,
          [projectId, nextVersion],
        );

        await client.query('commit');

        return mapBlueprintRow(insertResult.rows[0]);
      } catch (error) {
        await client.query('rollback');
        throw error;
      } finally {
        client.release();
      }
    },

    async getLatestBlueprintForProject(projectId, userId) {
      await ensureUserExists(userId);
      const owned = await getOwnedProject(projectId, userId);

      if (!owned) {
        return null;
      }

      const pool = await getPool();
      const result = await pool.query(
        `
          select *
          from blueprint_versions
          where project_id = $1
          order by version_number desc
          limit 1
        `,
        [projectId],
      );

      return result.rows[0] ? mapBlueprintRow(result.rows[0]) : null;
    },

    async listBlueprintVersionsForProject(projectId, userId) {
      await ensureUserExists(userId);
      const owned = await getOwnedProject(projectId, userId);

      if (!owned) {
        return null;
      }

      const pool = await getPool();
      const result = await pool.query(
        `
          select version_number, created_at
          from blueprint_versions
          where project_id = $1
          order by version_number desc
        `,
        [projectId],
      );

      return result.rows.map((row) => ({
        version: row.version_number,
        generatedAt: row.created_at,
      }));
    },

    async getAgentOutputCacheEntry(projectId, userId, cacheKey) {
      await ensureUserExists(userId);
      const owned = await getOwnedProject(projectId, userId);

      if (!owned) {
        return null;
      }

      const pool = await getPool();
      const result = await pool.query(
        `
          update agent_output_cache
          set last_used_at = now()
          where project_id = $1
            and cache_key = $2
            and (expires_at is null or expires_at > now())
          returning *
        `,
        [projectId, cacheKey],
      );

      return result.rows[0] ? mapAgentOutputCacheRow(result.rows[0]) : null;
    },

    async upsertAgentOutputCacheEntry(projectId, userId, entry) {
      await ensureUserExists(userId);
      const owned = await getOwnedProject(projectId, userId);

      if (!owned) {
        return null;
      }

      const pool = await getPool();
      const result = await pool.query(
        `
          insert into agent_output_cache (
            project_id,
            phase_number,
            step_key,
            agent_id,
            task_kind,
            cache_key,
            model,
            prompt_version_hash,
            normalized_input_hash,
            dependency_hash,
            status,
            output_json,
            source_meta_json,
            expires_at
          ) values (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14
          )
          on conflict (cache_key)
          do update set
            phase_number = excluded.phase_number,
            step_key = excluded.step_key,
            agent_id = excluded.agent_id,
            task_kind = excluded.task_kind,
            model = excluded.model,
            prompt_version_hash = excluded.prompt_version_hash,
            normalized_input_hash = excluded.normalized_input_hash,
            dependency_hash = excluded.dependency_hash,
            status = excluded.status,
            output_json = excluded.output_json,
            source_meta_json = excluded.source_meta_json,
            expires_at = excluded.expires_at,
            last_used_at = now()
          returning *
        `,
        [
          projectId,
          entry.phaseNumber ?? null,
          entry.stepKey ?? null,
          entry.agentId,
          entry.taskKind,
          entry.cacheKey,
          entry.model,
          entry.promptVersionHash,
          entry.normalizedInputHash,
          entry.dependencyHash,
          entry.status ?? 'ready',
          JSON.stringify(entry.outputJson),
          entry.sourceMetaJson == null ? null : JSON.stringify(entry.sourceMetaJson),
          entry.expiresAt ?? null,
        ],
      );

      return mapAgentOutputCacheRow(result.rows[0]);
    },

    async getPhaseInstanceForProject(projectId, userId, phaseNumber) {
      await ensureUserExists(userId);
      const owned = await getOwnedProject(projectId, userId);

      if (!owned) {
        return null;
      }

      const pool = await getPool();
      const result = await pool.query(
        `
          select *
          from phase_instances
          where project_id = $1 and phase_number = $2
          limit 1
        `,
        [projectId, phaseNumber],
      );

      return result.rows[0] ? mapPhaseInstanceRow(result.rows[0]) : null;
    },

    async upsertPhaseInstanceForProject(projectId, userId, phase) {
      await ensureUserExists(userId);
      const owned = await getOwnedProject(projectId, userId);

      if (!owned) {
        return null;
      }

      const pool = await getPool();
      const client = await pool.connect();

      try {
        await client.query('begin');

        const result = await client.query(
          `
            insert into phase_instances (
              project_id,
              phase_number,
              title,
              state,
              summary,
              generated_content,
              user_state,
              progress,
              tasks,
              latest_run_id,
              generated_at
            ) values (
              $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8::jsonb, $9::jsonb, $10, $11
            )
            on conflict (project_id, phase_number)
            do update set
              title = excluded.title,
              state = excluded.state,
              summary = excluded.summary,
              generated_content = excluded.generated_content,
              user_state = excluded.user_state,
              progress = excluded.progress,
              tasks = excluded.tasks,
              latest_run_id = excluded.latest_run_id,
              generated_at = excluded.generated_at,
              updated_at = now()
            returning *
          `,
          [
            projectId,
            phase.phaseNumber,
            phase.title,
            phase.state,
            phase.summary,
            JSON.stringify(phase.generatedContent),
            JSON.stringify(phase.userState ?? {}),
            JSON.stringify(phase.progress ?? {}),
            JSON.stringify(phase.tasks ?? []),
            phase.latestRunId ?? null,
            phase.generatedAt ?? new Date().toISOString(),
          ],
        );

        await client.query(
          `
            update projects
            set status = 'in_progress',
                current_phase_number = greatest(coalesce(current_phase_number, 0), $2),
                updated_at = now()
            where id = $1
          `,
          [projectId, phase.phaseNumber],
        );

        await client.query('commit');
        return mapPhaseInstanceRow(result.rows[0]);
      } catch (error) {
        await client.query('rollback');
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
