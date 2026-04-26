# VentraPath Migrations

This folder is reserved for the migration sequence defined in:

- `../migration-plan.md`

Recommended file order:

1. `0001_bootstrap_database.sql`
2. `0002_create_users.sql`
3. `0003_create_projects.sql`
4. `0004_create_agent_runs.sql`
5. `0005_create_blueprint_versions.sql`
6. `0006_project_blueprint_link_cleanup.sql`
7. `0007_create_phase_instances.sql`
8. `0008_seed_phase_instances.sql`
9. `0009_create_tasks.sql`
10. `0010_create_weekly_plans.sql`
11. `0011_create_files.sql`
12. `0012_create_subscriptions.sql`
13. `0013_create_audit_events.sql`

Do not dump every table into one monster migration.

Follow the product spine.
