[![Build](https://github.com/It-s-Saturday/Fornear/actions/workflows/build.yml/badge.svg)](https://github.com/It-s-Saturday/Fornear/actions/workflows/build.yml)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-5-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

# Fornear

![logo](https://github.com/jibranabsarulislam/Fornear/assets/70596906/a495d28d-7616-4ca3-91d7-df3824a4b133)

### A click-and-collect ~~solution~~ proposal to benefit the operations of Petey's Pantry @ Oglethorpe University.

[View the Wiki!](https://github.com/jibranabsarulislam/Fornear/wiki/Staff:-Navigating-the-Staff-Dashboard)

<a href='https://devpost.com/software/fornear'>View on Devpost</a>

---
### Context


Oglethorpe University is a school right outside of Atlanta, Georgia that is recognized nationally for their commitment to affordability, individualized student support, their diverse student population, and quality of academic programs. [https://oglethorpe.edu/about/]

They were also the first Georgia college to partner with TheDream.US to provide scholarships to qualified immigrant students who came to the United States as children, known as “DREAMers.” [https://oglethorpe.edu/admission/undergraduate-admission/scholarships-and-aid/dream-us-faqs/]

An on-campus organization called Petey's Pantry stores, maintains an inventory, handles requests, and distributes foodstuffs throughout the Oglethorpe community. [https://health.oglethorpe.edu/food-pantry/]


![image](https://github.com/jibranabsarulislam/Fornear/assets/70596906/fef8a16f-8663-433f-8785-df94cf1a84fa)

---

### Background
Fornear is a play on "For here [or to go?]", derived from the Italian verb "Fornire", which translates to provide, or supply. Replacing "here" with "near" implies a familiar and community-based connotation.

Petey’s Pantry student workers use Microsoft Forms, Microsoft Excel, and text-communication to operate their service.

Fornear is a responsive web-app that allows users to request packages of foodstuffs, configured by staff. They set package names, what foodstuffs comprise them, and the dietary restriction(s) the package satisfies.

A package's stock is automatically reported based on the inventory's status. Staff can add, query, modify, and audit the inventory to reflect the pantry's current stock. Students can view available packages, the quantity, and which dietary restrictions each package adheres to. From there, they can request a package, along with 3 personal care products (PCPs), or a package of 7 PCPs.

---

### Installation

This is a React/Flask project that uses MongoDB Atlas as a database. To run this project, you will need to have Node.js, Python, and MongoDB installed on your machine.

1. Fork the repository @ https://github.com/jibranabsarulislam/Fornear/fork
2. Clone the repository to your local machine
3. Install dependencies

	Frontend:
	```
	cd frontend
	npm install
	```

	Backend:
	```
	cd backend
	python -m venv venv
	. ./venv/bin/activate # (Non-Windows)
	# OR
	. ./venv/Scripts/activate # (Windows)
	pip install -r requirements.txt
	```
4. Create a MongoDB Atlas account and create a cluster OR run locally
	- For either option, create a database and collection
		- Database: `fornear-v1`
		- Collection: `inventory`
	- To run locally, `python app.py --local` (skip to step 6)

5. Create a `fornear_secrets.py` in `backend/` with the following:
	```
	# MongoDB Atlas connection string
	MONGO_URI = "mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority"
	```
6. Run the project
	
	Terminal 1 - Frontend:
	```
	cd frontend
	npm start
	```

	Terminal 2 - Backend:

	```
	cd backend
	. ./venv/bin/activate # (Non-Windows)
	# OR
	. ./venv/Scripts/activate # (Windows)
	flask run --reload
 	# OR, if you have MongoDB Community Server running locally,
  	python app.py --local
	```



## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://www.jibran.me"><img src="https://avatars.githubusercontent.com/u/70596906?v=4?s=100" width="100px;" alt="jayway"/><br /><sub><b>jayway</b></sub></a><br /><a href="#maintenance-jibranabsarulislam" title="Maintenance">🚧</a> <a href="https://github.com/It-s-Saturday/Fornear/commits?author=jibranabsarulislam" title="Code">💻</a> <a href="https://github.com/It-s-Saturday/Fornear/commits?author=jibranabsarulislam" title="Documentation">📖</a> <a href="https://github.com/It-s-Saturday/Fornear/pulls?q=is%3Apr+reviewed-by%3Ajibranabsarulislam" title="Reviewed Pull Requests">👀</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/neeravbhaskarla"><img src="https://avatars.githubusercontent.com/u/57148990?v=4?s=100" width="100px;" alt="Neerav"/><br /><sub><b>Neerav</b></sub></a><br /><a href="https://github.com/It-s-Saturday/Fornear/commits?author=neeravbhaskarla" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/sejalapeno"><img src="https://avatars.githubusercontent.com/u/110482301?v=4?s=100" width="100px;" alt="sejalapeno"/><br /><sub><b>sejalapeno</b></sub></a><br /><a href="https://github.com/It-s-Saturday/Fornear/commits?author=sejalapeno" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://colbe.me"><img src="https://avatars.githubusercontent.com/u/90277989?v=4?s=100" width="100px;" alt="Colbe Roberson"/><br /><sub><b>Colbe Roberson</b></sub></a><br /><a href="https://github.com/It-s-Saturday/Fornear/commits?author=cgr28" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/karthickbharathi1"><img src="https://avatars.githubusercontent.com/u/54052847?v=4?s=100" width="100px;" alt="Karthick B"/><br /><sub><b>Karthick B</b></sub></a><br /><a href="https://github.com/It-s-Saturday/Fornear/commits?author=karthickbharathi1" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
