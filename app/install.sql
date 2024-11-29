CREATE TABLE "user" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "username" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "token" TEXT,
  "create_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "update_time" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO user (username, password, status) VALUES ('{$username}', '{$password}', '正常');

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

CREATE TABLE "room" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT,
  "sort" integer
);

INSERT INTO room ("name", "sort") VALUES ("卧室", 2);
INSERT INTO room ("name", "sort") VALUES ("客厅", 3);
INSERT INTO room ("name", "sort") VALUES ("厨房", 4);
INSERT INTO room ("name", "sort") VALUES ("院子", 5);
INSERT INTO room ("name", "sort") VALUES ("阳台", 6);
INSERT INTO room ("name", "sort") VALUES ("办公室", 7);
