-- public.users definition

-- Drop table

-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid NOT NULL,
	firstname varchar NOT NULL,
	lastname varchar NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	createdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT users_pk PRIMARY KEY (id),
	CONSTRAINT users_un UNIQUE (email)
);

-- public.courses definition

-- Drop table

-- DROP TABLE public.courses;

CREATE TABLE public.courses (
	id uuid NOT NULL,
	"name" varchar NOT NULL,
	description varchar NOT NULL,
	subscribers _varchar NULL,
	thumbnail varchar NOT NULL,
	createdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT courses_pk PRIMARY KEY (id)
);

-- public.topics definition

-- Drop table

-- DROP TABLE public.topics;

CREATE TABLE public.topics (
	id uuid NOT NULL,
	title varchar NOT NULL,
	note varchar NOT NULL,
	description varchar NOT NULL,
	video varchar NOT NULL,
	createdat time NOT NULL DEFAULT CURRENT_TIMESTAMP,
	courseid uuid NOT NULL,
	thumbnail varchar NULL,
	CONSTRAINT topics_pk PRIMARY KEY (id),
	CONSTRAINT topics_courses_fk FOREIGN KEY (courseid) REFERENCES public.courses(id) ON DELETE CASCADE
);