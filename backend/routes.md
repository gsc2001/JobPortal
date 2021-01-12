### Routes

-   [x] `POST` /api/core/login
-   [x] `POST` /api/core/register
-   [ ] ~~Google login~~
-   [x] `GET` /api/jobs
-   [x] `POST` /api/jobs
-   [x] `POST` /api/jobs/{id}/apply
-   [x] `POST` /api/jobs/{id}/rate # only accepted applicants can
-   [ ] `GET` /api/applications?for="me"| "{job_id}"
-   [x] `PATCH` /api/user/rate/{id} # body contains a type variable for rec/applicant
-   [x] `GET` /api/user/me
-   [x] `PUT` /api/user/me
-   [x] `DELETE` /api/jobs/{id}
-   [x] `PATCH` /api/jobs/{id}
-   [ ] `PUT` /api/application/{id}/status_update
