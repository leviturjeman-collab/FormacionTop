create extension if not exists vector;
create table documents(id serial primary key, title text, body text);
create table evals(id serial primary key, question text, expected text);
