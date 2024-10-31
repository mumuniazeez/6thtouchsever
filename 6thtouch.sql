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

-- public."admin" definition

-- Drop table

-- DROP TABLE public."admin";

CREATE TABLE public."admin" (
	id uuid NOT NULL,
	firstname varchar NOT NULL,
	lastname varchar NOT NULL,
	email varchar NOT NULL,
	"password" varchar NOT NULL,
	createdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT admin_pk_1 PRIMARY KEY (id),
	CONSTRAINT admin_un_1 UNIQUE (email)
);

-- public.courses definition

-- Drop table

-- DROP TABLE public.courses;

CREATE TABLE public.courses (
	id uuid NOT NULL,
	title varchar NOT NULL,
	description varchar NOT NULL,
	subscribers _varchar NULL,
	thumbnail varchar NOT NULL,
	createdat timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	ispublic bool NOT NULL DEFAULT false,
	price money NOT NULL,
	category varchar NOT NULL,
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
	CONSTRAINT topics_pk PRIMARY KEY (id),
	CONSTRAINT topics_courses_fk FOREIGN KEY (courseid) REFERENCES public.courses(id) ON DELETE CASCADE
);

-- public."comments" definition

-- Drop table

-- DROP TABLE public."comments";

CREATE TABLE public."comments" (
	id uuid NOT NULL,
	message varchar NOT NULL,
	"user" uuid NULL,
	commentid uuid NULL,
	"type" varchar NOT NULL,
	createdat timetz NOT NULL DEFAULT CURRENT_TIMESTAMP,
	"admin" uuid NULL,
	topicid uuid NOT NULL,
	courseid uuid NOT NULL,
	CONSTRAINT comments_pk PRIMARY KEY (id),
	CONSTRAINT comments_admin_fk FOREIGN KEY ("admin") REFERENCES public."admin"(id),
	CONSTRAINT comments_comments_fk FOREIGN KEY (id) REFERENCES public."comments"(id),
	CONSTRAINT comments_courses_fk FOREIGN KEY (courseid) REFERENCES public.courses(id) ON DELETE CASCADE,
	CONSTRAINT comments_topics_fk FOREIGN KEY (topicid) REFERENCES public.topics(id),
	CONSTRAINT comments_users_fk FOREIGN KEY ("user") REFERENCES public.users(id)
);