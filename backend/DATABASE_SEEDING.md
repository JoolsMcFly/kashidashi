# Database Seeding

## Overview

The Kashidashi backend includes a seeding system to populate the database with initial data for development and testing.

## Running Seeds

### Using Make (Recommended)
```bash
make seed
```

### Direct NPM Command
```bash
# From the project root
docker compose exec backend npm run seed

# Or from within the backend container
npm run seed
```

## Default Seed Data

### Users

The seeder creates two default users:

**Admin User:**
- Username: `admin`
- Password: `admin123`
- Role: Administrator
- Location: None (admins don't require a location)

**Regular User:**
- Username: `user`
- Password: `user123`
- Role: Regular User
- Location: None (needs to be set via admin panel)

## Idempotency

The seed command is **idempotent** - it can be run multiple times safely. It checks if users already exist before creating them:

- If a user with the same username exists, it will be skipped
- Only new users will be created
- Existing users will not be modified or duplicated

## Important Notes

1. **Change Default Passwords**: The default passwords are for development only. Change them immediately in production environments.

2. **Regular User Location**: The regular user is created without a location. After seeding, use the admin panel to assign a location to this user.

3. **Production Warning**: Do NOT run seeds in production with default credentials. Either:
   - Change the passwords in the seeder before running
   - Delete these accounts and create new ones via the admin panel
   - Use environment variables for seed credentials

## Adding More Seeds

To add additional seed data:

1. Create a new seeder in `src/database/seeds/`
2. Inject the seeder into `SeedCommand` in `src/database/commands/seed.command.ts`
3. Call the seeder's `run()` method in the command

Example:
```typescript
// src/database/seeds/locations.seed.ts
@Injectable()
export class LocationsSeed {
  async run(): Promise<void> {
    // Your seeding logic here
  }
}
```
