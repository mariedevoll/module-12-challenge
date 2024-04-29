\c business_db

INSERT INTO department (name)
VALUES ('Sales'),
    ('Finance'),
    ('Legal'),
    ('Engineering'),
    ('Operations');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager, 75000, 1'),
    ('Sales Associate, 60000, 1'),
    ('Finance Analyst, 60000, 2'),
    ('Legal Manager, 90000, 3'),
    ('Legal Assistant, 85000, 3'),
    ('Engineering Manager, 120000, 4'),
    ('Engineering Associate, 100000, 4'),
    ('Operations Manager, 80000, 5'),
    ('Operations Associate, 65000, 5');

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michael", "Bluth", 1, NULL),
    ("Barry", "Zuckerkorn", 2, 1),
    ("Stan", "Sitwell", 3, 2),
    ("Steve", "Holt", 4, 2),
    ("Lucille", "Bluth", 5, NULL),
    ("Lindsay", "Fünke", 6, 1),
    ("Tony", "Wonder", 7, 2),
    ("Wayne", "Jarvis", 8, NULL),
    ("Gene", "Paramsean", 9, 1),
    ("Marta", "Estrella", 10, NULL);