# **Medical Device Idea Planner**

Development Specification v1.0

December 2025 | Design 1st

**QUICK REFERENCE**

**Purpose:** AI-powered tool that generates personalized development plans for physician/dentist inventors  
**Input:** 11 structured questions \+ free-text device description  
**Output:** Personalized 8-section development plan \+ downloadable PDF  
**Lead capture:** Email gate before results; CTA to book consultation  
**Reference:** Builds on existing budget tool at planning.design1st.com/budget-tool

# **1\. Product Overview**

## **1.1 What This Tool Does**

The Medical Device Idea Planner helps practicing physicians and dentists move from "idea in notebook" to "clear action plan" without requiring a sales call. Unlike the existing budget tool (which estimates costs from a free-text description), this tool:

* Asks structured questions to understand their specific situation  
* Generates a personalized development roadmap (not pass/fail judgment)  
* Sets realistic expectations on timeline, budget, and regulatory pathway  
* Identifies risks and critical early decisions  
* Captures qualified leads with context for sales team follow-up

## **1.2 What This Tool Is NOT**

* NOT a yes/no validator — every submission gets a plan  
* NOT legal advice — always defers to "consult patent attorney"  
* NOT a quote generator — provides ranges, not fixed estimates  
* NOT a replacement for technical consultation — funnels to human review

## **1.3 User Flow Summary**

**Step 1:** User lands on tool page

**Step 2:** Email gate — name, email, practitioner status

**Step 3:** 11 structured questions (progressive disclosure recommended)

**Step 4:** Free-text device description

**Step 5:** AI generates personalized plan

**Step 6:** Results displayed on screen \+ PDF download option

**Step 7:** CTA: Book free project review with D1 team

# **2\. Input Questions — Complete Specification**

## **2.1 Email Gate (Required Before Questions)**

Display before any questions. All fields required.

| Field | Input Type | Notes |
| :---- | :---- | :---- |
| Name | Text input | First \+ Last name |
| Email | Email input (validated) | Primary contact for follow-up |
| Practitioner? | Radio: Yes / No | "Are you a practicing physician, dentist, or veterinarian?" |

**If Practitioner \= No:** Still allow access, but tag lead as "non-practitioner" in CRM. Same plan output.

## **2.2 Structured Questions (11 Total)**

Present questions one at a time or in logical groups. Store all responses.

**Q1: Development Stage**  
**Display text:** "What stage is your device idea?"

**Options:**

* Napkin sketch / concept only  
* Detailed drawings or CAD models  
* Basic prototype (non-functional or rough)  
* Working prototype  
* Already using informally in my practice

**Data key:** stage

*Why we ask:* Determines starting point and how much work is already done. Maps to "where are you now?" from Matt/James feedback.

**Q2: Device Category**  
**Display text:** "What type of device is this?"

**Options:**

* Surgical instrument / tool  
* Diagnostic device  
* Therapeutic device  
* Implant  
* Dental device  
* Veterinary device  
* Software / digital health (SaMD)  
* Other

**Data key:** device\_type

*Why we ask:* Drives regulatory pathway logic and expertise matching.

**Q3: Device Complexity**  
**Display text:** "Is your device hardware-only, software-only, or a combination?"

**Options:**

* Hardware only (mechanical, electrical, or both)  
* Software only (app, algorithm, SaMD)  
* Hardware \+ Software combination  
* Device \+ Drug combination

**Data key:** complexity

*Why we ask:* Combination products have different regulatory paths. Device \+ Drug triggers FDA's Office of Combination Products.

**Q4: IP Status**  
**Display text:** "What's the current status of intellectual property protection?"

**Options:**

* No IP protection yet  
* Provisional patent filed  
* Full patent application filed  
* Patent granted  
* Not sure / need to check

**Data key:** ip\_status

*Why we ask:* Critical risk flag. No IP \+ sharing details \= potential exposure.

**Q5: Time Availability**  
**Display text:** "How much time can you realistically commit to this project each week?"

**Options:**

* Less than 2 hours  
* 2-5 hours  
* 5-10 hours  
* 10+ hours

**Data key:** time\_commitment

*Why we ask:* Sets timeline expectations. Less time \= longer project. Validates D1's "keep your practice" value prop.

**Q6: Budget Expectation**  
**Display text:** "What's your budget expectation for full development through FDA clearance?"

**Options:**

* Less than $50,000  
* $50,000 \- $150,000  
* $150,000 \- $300,000  
* $300,000 \- $500,000  
* $500,000+  
* I have no idea

**Data key:** budget\_expectation

*Why we ask:* Reality check trigger. \<$50K for most devices \= unrealistic expectation that needs addressing.

**Q7: End Goal**  
**Display text:** "What's your end goal for this device?"

**Options:**

* Build a company around it  
* License to an existing manufacturer  
* Sell the IP outright  
* Use in my own practice only  
* Not sure yet

**Data key:** end\_goal

*Why we ask:* Shapes the entire development path. Company building vs. licensing \= very different strategies.

**Q8: Biggest Concern**  
**Display text:** "What's your biggest concern right now?"

**Options:**

* I don't know where to start  
* FDA/regulatory process seems impossible  
* Cost and financial risk  
* Time commitment while running my practice  
* Finding the right development partners  
* Protecting my idea / IP concerns

**Data key:** biggest\_concern

*Why we ask:* Emotional hook for personalization. Plan addresses this directly.

**Q9: Employer Status (CRITICAL RISK FLAG)**  
**Display text:** "Are you employed by a hospital, academic institution, or healthcare system?"

**Options:**

* No — private practice or self-employed  
* Yes — hospital employed  
* Yes — academic/university  
* Yes — healthcare system employed

**Data key:** employer\_type

*Why we ask:* Employment contracts often include IP assignment clauses. This is a project-killer if not addressed early. Must trigger explicit warning in output.

**Q10: Co-Inventors**  
**Display text:** "Are there other inventors or stakeholders involved in this idea?"

**Options:**

* Just me  
* Yes, 1-2 other people  
* Yes, 3 or more people  
* Working with a company already

**Data key:** coinventors

*Why we ask:* Multiple inventors \= IP ownership complexity. Plan should recommend ownership agreement early.

**Q11: Target Markets**  
**Display text:** "Where do you intend to sell this device?"

**Options:**

* United States only  
* US and Canada  
* US and Europe  
* Global  
* Not sure yet

**Data key:** target\_markets

*Why we ask:* Different markets \= different regulatory requirements (FDA, CE Mark, Health Canada). Affects timeline and budget.

## **2.3 Free-Text Description**

**Display text:** "Describe your device idea and the clinical problem it solves."

**Helper text:** "Include: What does it do? What problem does it solve? How is it different from existing solutions?"

**Input type:** Multi-line text area

**Minimum:** 200 characters (enforced)

**Maximum:** 2,000 characters

**Data key:** device\_description

# **3\. Output Plan — Complete Structure**

The AI generates a personalized plan with 8 sections. Each section has conditional logic based on user inputs.

## **3.1 Plan Header**

**Title:** "Your Medical Device Development Plan"

**Subtitle:** "\[Device Type\] — \[Stage\] — \[End Goal\]"

*Example:* "Surgical Instrument — Working Prototype — License to Manufacturer"

**Date:** Generated \[current date\]

**SECTION 1: Where You Are Now**  
**Purpose:** Reflect back their current stage, validate their progress.

**Content (conditional on stage):**

* **Napkin sketch:** "You're at the concept stage. Many successful devices started exactly here. Your clinical insight is your biggest asset."  
* **Detailed drawings:** "You've moved past concept into design documentation. This puts you ahead of most physician inventors who never get ideas out of their heads."  
* **Basic prototype:** "You have tangible proof of concept. The next step is evaluating whether this prototype can evolve toward a manufacturable design."  
* **Working prototype:** "You've validated core functionality. Focus now shifts to design for manufacturing, regulatory strategy, and testing requirements."  
* **Using informally:** "Real-world use is valuable data — but proceed carefully. Informal clinical use without clearance has regulatory implications. Document everything."

**SECTION 2: Your Likely Regulatory Pathway**  
**Purpose:** Demystify FDA. Give them a framework.

**Content (conditional on device\_type \+ complexity):**  
See Knowledge Base (Section 5\) for full regulatory pathway matrix.

**Always include:** 

* Likely classification (Class I, II, or III)  
* Likely pathway (510(k), De Novo, PMA, Exempt)  
* Typical timeline range for that pathway  
* Key regulatory considerations specific to device type

**REQUIRED DISCLAIMER:** "This is a preliminary assessment based on device category. Final classification requires detailed technical and intended use review. Design 1st recommends regulatory consultation before making business decisions based on this pathway estimate."

**SECTION 3: Your Next 3 Steps**  
**Purpose:** Actionable, not overwhelming. Three things, not thirty.

**Logic: Select 3 steps based on input combinations. Priority order:**

**If ip\_status \= "No IP protection yet":**

* Step 1 ALWAYS: "Consult a patent attorney before sharing detailed specifications with anyone. A provisional patent filing costs $2-5K and buys you 12 months of protection."

**If employer\_type ≠ "No — private practice":**

* Step 1 or 2 ALWAYS: "Review your employment agreement for IP assignment clauses. Many hospital and academic contracts claim ownership of inventions created during employment. Address this before investing further."

**If coinventors ≠ "Just me":**

* Include: "Draft a co-inventor agreement defining ownership percentages, decision rights, and financial contributions before spending significant money."

**If stage \= "Napkin sketch":**

* Include: "Document the clinical problem, your proposed solution, and why existing alternatives fall short. This becomes the foundation for everything else."

**If stage \= "Using informally":**

* Include: "Stop informal clinical use until you understand regulatory implications. Document all existing use cases, outcomes, and patient interactions — this data may be valuable for future FDA submissions."

**SECTION 4: Realistic Timeline**  
**Purpose:** Set expectations. Never single numbers — always ranges.

**Format:** Visual timeline with milestone markers

**Key milestones to include:**

* Concept finalization  
* Design freeze  
* Prototype validation  
* Regulatory submission  
* FDA clearance/approval  
* Manufacturing ramp-up  
* Market launch

**Conditional adjustments:**

* time\_commitment \= "\<2 hours" → Add 50% to timeline  
* complexity \= "Device \+ Drug" → Add 12-24 months  
* target\_markets includes "Europe" → Add 6-12 months for CE marking

**REQUIRED DISCLAIMER:** "These timelines assume no major design pivots, regulatory delays, or funding gaps. Actual duration varies based on technical complexity and market factors."

**SECTION 5: Budget Reality Check**  
**Purpose:** Address the elephant. If their expectation is off, say so directly.

**Structure:**

**Part A: Compare expectation to reality**  
Pull their budget\_expectation answer. Compare to realistic range for their device\_type. See Knowledge Base for ranges.

**If budget\_expectation \= "\<$50K" AND device requires FDA clearance:**  
"Your budget expectation of under $50,000 is significantly below typical development costs for this type of device. Most medical devices requiring FDA clearance cost $150,000-$500,000+ to develop. This doesn't mean you can't proceed — it means you need to understand the investment required and plan accordingly. Many physician inventors start with a phased approach, validating key assumptions before committing full development budget."

**Part B: Budget breakdown**  
Show ranges by category:

* Design & Engineering: $X \- $Y  
* Prototyping & Testing: $X \- $Y  
* Regulatory: $X \- $Y  
* Manufacturing Setup: $X \- $Y  
* Contingency (15-20%): $X \- $Y

**REQUIRED DISCLAIMER:** "These are planning estimates only. Actual costs depend on technical complexity, testing requirements, and regulatory pathway. Design 1st provides detailed cost estimates after technical review."

**SECTION 6: Key Risks to Address Early**  
**Purpose:** Surface the things that kill projects. Be direct.

**Format:** Top 3 risks based on their inputs, ranked by severity.

**Risk trigger matrix:**

| Input Condition | Risk to Surface |
| :---- | :---- |
| ip\_status \= "No IP" | IP EXPOSURE: Sharing details without protection risks losing rights |
| employer\_type ≠ private | EMPLOYER IP CLAIM: Employment agreement may assign invention rights |
| budget \< realistic range | UNDERFUNDING: Project may stall mid-development |
| device\_type \= "Implant" | CLINICAL DATA: Implants typically require clinical studies |
| complexity \= "Device \+ Drug" | COMBO PRODUCT: Requires coordination with FDA's Office of Combination Products |
| coinventors ≠ "Just me" | OWNERSHIP DISPUTES: Multiple inventors without agreement \= future conflict |
| stage \= "Using informally" | REGULATORY VIOLATION: Unapproved clinical use has legal implications |

**SECTION 7: What Design 1st Would Focus On First**  
**Purpose:** Soft sell. Show expertise without pushing.

**Format:** 2-3 specific actions tailored to their situation.

**Tone:** "Based on where you are and what you've told us, if you engaged Design 1st, we would likely start by..."  
**Examples by stage:**

* **Napkin sketch:** "Conducting a feasibility assessment to evaluate technical viability before significant investment."  
* **Working prototype:** "Reviewing your prototype for manufacturability and identifying design changes needed for production."  
* **Any stage:** "Developing a regulatory strategy and identifying the most efficient path to market."

*Key D1 positioning points to weave in:*

* We're your technical team — you keep 100% of your IP  
* Hourly rate model — no equity, no ownership stake  
* Phased approach — exit anytime, keep all work product  
* Manufacturing baked in from day one

**SECTION 8: Call to Action**  
**Two CTAs based on lead qualification:**

**PRIMARY CTA (qualified leads — budget ≥ $50K):**  
Headline: "Ready to Discuss Your Plan?"

Body: "Our senior technical team reviews early-stage device concepts at no cost. We'll tell you what we see — including whether now is the right time to move forward."

Button: "Book Free Project Review" → Calendly link

**SECONDARY CTA (all leads):**  
Button: "Download Your Plan (PDF)" → generates PDF of their personalized plan

**CONDITIONAL CTA (budget \< $50K):**  
Show download button but NOT the "Book Free Project Review" button. Instead show: "Explore Our Resources" linking to D1 educational content. These leads need nurturing before they're ready for consultation.

# **4\. Edge Cases & Fallback Logic**

## **4.1 Input Validation**

| Scenario | Handling |
| :---- | :---- |
| device\_type \= "Other" | Skip regulatory pathway section. Replace with: "Your device type requires individual assessment to determine regulatory pathway. We recommend booking a call to discuss specifics." |
| device\_type \= "Veterinary" | Different regulatory section: "Veterinary devices are not regulated by FDA's CDRH. Requirements vary by country and intended animal species. Timelines and costs are typically lower than human medical devices." |
| Free-text \< 200 chars | Block submission. Show: "Please provide more detail about your device and the clinical problem it solves. This helps us create a more useful plan for you." |
| Nonsense free-text | AI detection: If description lacks medical/clinical terms, prompt: "This tool is designed for medical device development. Please describe the clinical problem your device addresses." |
| Non-medical device | AI detection: If no medical intent detected, show: "This tool is designed for medical device development. For consumer or industrial products, check out our general budget tool." \+ link |
| Practitioner \= No | Allow access. Tag lead as "non-practitioner" in CRM. Same plan output — D1 works with non-practitioner inventors too. |

## **4.2 Combination Scenarios**

Some input combinations require special handling:

**HIGH-RISK COMBINATION:**  
ip\_status \= "No IP" \+ employer\_type \= "Academic" \+ stage \= "Working prototype"  
Surface BOTH IP risks prominently. This person may have already lost rights to their invention. Plan should lead with: "Before proceeding, you need to address two critical IP issues..."

**EXPECTATION MISMATCH:**  
budget\_expectation \= "\<$50K" \+ device\_type \= "Implant" \+ end\_goal \= "Build a company"  
Major gap between expectation and reality. Budget section should be direct: "Building a company around an implantable device typically requires $500K-$2M+ in development capital. Your current budget expectation suggests exploring licensing as an alternative path."

**FAST-TRACK CANDIDATE:**  
stage \= "Working prototype" \+ ip\_status \= "Patent granted" \+ budget\_expectation \= "$300K+" \+ time\_commitment \= "5-10 hours"  
Hot lead. Plan should be encouraging: "You're further along than most physician inventors we work with. With IP protection in place and realistic expectations, you're positioned to move efficiently."

# **5\. Knowledge Base — Reference Data**

This data feeds the AI's responses. Update quarterly. Last updated: December 2025\.

## **5.1 Regulatory Pathway Matrix**

| Device Type | Typical Class | Likely Pathway | Timeline (FDA only) |
| :---- | :---- | :---- | :---- |
| Surgical instrument | Class I-II | 510(k) or Exempt | 6-12 months (510k); N/A (exempt) |
| Diagnostic device | Class II | 510(k) | 9-15 months |
| Therapeutic device | Class II-III | 510(k) or PMA | 12-24 months (510k); 2-4 years (PMA) |
| Implant | Class II-III | 510(k), De Novo, PMA | 18-36 months (often requires clinical) |
| Dental device | Class I-II | 510(k) or Exempt | 6-12 months |
| Software (SaMD) | Class I-II | 510(k) or De Novo | 6-18 months |
| Device \+ Drug combo | Varies | OCP designation | 3-5+ years |

## **5.2 Budget Ranges by Device Type**

| Device Type | Development | Regulatory | Total Range |
| :---- | :---- | :---- | :---- |
| Simple surgical tool | $75K \- $150K | $25K \- $75K | $100K \- $250K |
| Electromech device | $150K \- $350K | $50K \- $150K | $200K \- $500K |
| Implant (Class II) | $250K \- $500K | $100K \- $300K | $350K \- $800K |
| Implant (Class III) | $500K \- $1.5M | $500K \- $2M+ | $1M \- $3.5M+ |
| Dental device | $75K \- $200K | $25K \- $75K | $100K \- $300K |
| SaMD / Software | $100K \- $300K | $30K \- $100K | $130K \- $400K |

## **5.3 Timeline Modifiers**

Apply these adjustments to base timeline estimates:

| Factor | Timeline Adjustment |
| :---- | :---- |
| time\_commitment \= "\<2 hours" | \+50% to timeline |
| complexity \= "Hardware \+ Software" | \+3-6 months |
| complexity \= "Device \+ Drug" | \+12-24 months |
| target\_markets includes Europe | \+6-12 months for CE marking |
| Clinical study required | \+12-24 months |
| stage \= "Working prototype" | \-3-6 months (head start) |

## **5.4 Design 1st Positioning Points**

Use these consistently across outputs:

* **IP Ownership:** "You keep 100% of your IP. We're your technical team, not partners or investors."  
* **Business Model:** "Hourly rate model — no equity stake, no ownership claims, no surprises."  
* **Flexibility:** "Phased development with exit points. Pause or stop anytime — you keep all work product."  
* **Time Commitment:** "Keep your practice. We need 30-60 minutes per week for decisions and direction."  
* **Manufacturing:** "Manufacturing is baked in from day one. We don't hand off designs that can't be built."  
* **Experience:** "16+ years, 1200+ products, 25+ physician inventors, 10+ dentist inventors."  
* **Regulatory:** "Right team, right process, 16 years of experience. FDA is confidently navigable with consistency."

# **6\. Technical Implementation Notes**

## **6.1 Data Storage & Privacy**

* Store all structured responses (Q1-Q11) indefinitely for CRM and analytics  
* Free-text device descriptions: Consider retention limits (90 days?) to limit IP exposure  
* Privacy policy must disclose data collection and AI processing  
* GDPR consideration if EU visitors expected

## **6.2 AI Prompt Structure**

The AI should receive:

* System prompt with D1 positioning, disclaimers, knowledge base  
* User input (all 11 structured answers \+ free text)  
* Output template structure (8 sections)  
* Conditional logic rules (what to show/hide based on inputs)

## **6.3 PDF Generation**

PDF should include:

* D1 branding (logo, colors)  
* All 8 plan sections  
* Generated date  
* Contact information  
* All required disclaimers  
* CTA with Calendly link

## **6.4 CRM Integration**

Push to CRM on submission:

* Contact: name, email  
* Lead source: "Idea Planner Tool"  
* Tags: practitioner (Y/N), device\_type, stage, budget\_expectation  
* Lead score: Based on qualification matrix (budget \+ stage \+ practitioner)  
* Notes: Full question responses for sales team context

## **6.5 Analytics Events**

Track:

* Page views  
* Email gate completion rate  
* Question completion rate (drop-off by question)  
* Plan generation (success/failure)  
* PDF downloads  
* Calendly clicks  
* Conversion: Submission → Meeting booked

**— END OF SPECIFICATION —**

*Design 1st | Medical Device Idea Planner | v1.0 | December 2025*  
*Questions? Contact Allan, VP Analytics*