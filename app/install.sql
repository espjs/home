CREATE TABLE "user" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "token" TEXT,
  "create_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "update_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO user (username, password, status) values ('{$username}', '{$password}', '正常');

CREATE TABLE "device" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT,
  "icon" TEXT,
  "token" TEXT,
  "template" TEXT,
  "code" TEXT,
  "config" TEXT,
  "room" TEXT,
  "status" text,
  "value" TEXT,
  "sort" integer,
  "create_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "update_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "template" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT,
  "icon" TEXT,
  "code" TEXT,
  "config" TEXT,
  "sort" integer,
  "create_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "update_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);