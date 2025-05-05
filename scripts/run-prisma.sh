# set error
set -e

node -v

echo prisma pull
npx dotenv -e .env.$1 -- npx prisma db pull --schema ./prisma/main-mysql/schema.prisma

echo prisma generation
npx dotenv -e .env.$1 -- npx prisma generate --schema ./prisma/main-mysql/schema.prisma

echo done