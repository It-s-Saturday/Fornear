# Fornear (WaffleHacks 2023)

![logo](https://github.com/jibranabsarulislam/Fornear/assets/70596906/a495d28d-7616-4ca3-91d7-df3824a4b133)

### A click-and-collect solution to benefit the operations of Petey's Pantry @ Oglethorpe University.

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

### Methods

Packages have:
- a name
- a collection of objects and their counts
- a creation date
- last updated date
- count available (>0 is available)

Staff can:
- Add/update items
	- Name
	- Type (F[ood], P[CP])
	- Count
	
    - -> Stretch: expiration date, prioritizing group by brand name/category

- Receive a notification every Friday to check every item's expiration

- Create "Packages"
	- Select items and quantity from the inventory
	- Indicate food restriction-friendly
	- Toggle visibility
	 Stretch: configure for auto-hide on out-of-stock

Students can:
- View visible packages
	- See how many packages are available at that time

- Request packages
	- Food Package
		Configured food package - 3 PCP items
	- Personal Care Package (PCP)
		7 PCP items
	- Redirect to a form
		Name, Email, Dietary Restrictions

---

### Resources
- https://uc.oglethorpe.edu/files/2017/01/OU-BrandStandards2017_F.pdf
- React.js, Flask, MongoDB Atlas (for convenience)
- Pipeline: TBD
- Deployment: TBD

### Threat Model

“Application needs authentication”

- Form-based user input
- Email confirmation required before staff processing (stretch)

“Application is vulnerable to injection attacks”
- Transactions are logged, but not presented to any view (neither staff, nor student)
- System view is isolated from student/staff operation

“Downtime”
- MongoDB hosts database separate from OU infrastructure
