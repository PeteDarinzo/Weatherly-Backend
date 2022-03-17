\echo 'Delete and recreate weatherly db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE IF EXISTS "weatherly";
CREATE DATABASE "weatherly";
\c "weatherly"

\i weatherly-schema.sql

\echo 'Delete and recreate weatherly_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE weatherly_test;
CREATE DATABASE weatherly_test;
\connect weatherly_test

\i weatherly-schema.sql
