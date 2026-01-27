import { SEO } from '../components/SEO';

export default function TermsAndConditions() {
  return (
    <div className="container-custom section-padding">
      <SEO title="Terms and Conditions" description="Terms and Conditions for Bina Adult Care" />

      <div className="md:grid md:grid-cols-4 gap-10">
        <nav className="hidden md:block md:col-span-1 sticky top-24">
          <div className="prose text-sm text-gray-700 dark:text-gray-300">
            <h4>On this page</h4>
            <ul className="space-y-2">
              <li><a href="#interpretation" className="hover:underline">Interpretation & Definitions</a></li>
              <li><a href="#acknowledgment" className="hover:underline">Acknowledgment</a></li>
              <li><a href="#links" className="hover:underline">Links to Other Sites</a></li>
              <li><a href="#termination" className="hover:underline">Termination</a></li>
              <li><a href="#liability" className="hover:underline">Limitation of Liability</a></li>
              <li><a href="#disclaimer" className="hover:underline">Disclaimer</a></li>
              <li><a href="#governing" className="hover:underline">Governing Law</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </nav>

        <article className="prose max-w-none text-gray-800 dark:text-gray-100 md:col-span-3">
          <header>
            <h1>Terms and Conditions for binaadultcare</h1>
            <p className="mt-1 text-sm text-muted-foreground"><strong>Last updated:</strong> January 27, 2026</p>
          </header>

          <section className="mt-6" id="intro">
            <p>Please read these terms and conditions carefully before using Our Service.</p>
          </section>

          <section className="mt-8" id="interpretation">
            <h2>Interpretation and Definitions</h2>
            <h3>Interpretation</h3>
            <p>
              The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
            </p>

            <h3>Definitions</h3>
            <ul>
              <li><strong>Affiliate</strong> — an entity that controls, is controlled by, or is under common control with a party.</li>
              <li><strong>Country</strong> — California, United States.</li>
              <li><strong>Company</strong> — binaadultcare, 5667 San Pablo Dam Rd, El Sobrante, CA 94803, USA.</li>
              <li><strong>Device</strong> — any device that can access the Service.</li>
              <li><strong>Service</strong> — the Website.</li>
              <li><strong>Terms</strong> — these Terms and Conditions, including any documents incorporated by reference.</li>
              <li><strong>Third-Party Social Media Service</strong> — services or content provided by a third party that are displayed, included, or linked to through the Service.</li>
              <li><strong>Website</strong> — binaadultcare, accessible from https://www.binaadultcare.com/.</li>
              <li><strong>You</strong> — the individual accessing or using the Service.</li>
            </ul>
          </section>

          <section className="mt-8" id="acknowledgment">
            <h2>Acknowledgment</h2>
            <p>
              These are the Terms and Conditions governing the use of this Service and the agreement between You and the Company. By accessing or using the Service You agree to be bound by these Terms.
            </p>
            <p>
              You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service.
            </p>
            <p>
              Your access to and use of the Service is also subject to Our Privacy Policy, which describes how We collect, use, and disclose personal information. Please read Our Privacy Policy carefully before using Our Service.
            </p>
          </section>

          <section className="mt-8" id="links">
            <h2>Links to Other Websites</h2>
            <p>
              Our Service may contain links to third-party websites or services that are not owned or controlled by the Company. The Company has no control over such third parties and assumes no responsibility for their content or practices.
            </p>
          </section>

          <section className="mt-8" id="thirdparty">
            <h2>Links from a Third-Party Social Media Service</h2>
            <p>
              The Service may display content or services provided by third-party social platforms. Your use of any Third-Party Social Media Service is governed by that third party's terms and policies.
            </p>
          </section>

          <section className="mt-8" id="termination">
            <h2>Termination</h2>
            <p>
              We may terminate or suspend Your access immediately, without prior notice or liability, for any reason, including if You breach these Terms.
            </p>
          </section>

          <section className="mt-8" id="liability">
            <h2>Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, the Company's total liability and any supplier liability under these Terms will be limited to the amount actually paid by You through the Service or 100 USD if You have not purchased anything.
            </p>
            <p>
              In no event shall the Company be liable for indirect, incidental, special, or consequential damages to the fullest extent permitted by law.
            </p>
          </section>

          <section className="mt-8" id="disclaimer">
            <h2>"AS IS" and "AS AVAILABLE" Disclaimer</h2>
            <p>
              The Service is provided "AS IS" and "AS AVAILABLE" without warranty of any kind. The Company disclaims all warranties and makes no promises that the Service will meet Your requirements or be error-free.
            </p>
          </section>

          <section className="mt-8" id="governing">
            <h2>Governing Law</h2>
            <p>
              The laws of the Country (excluding conflict of laws rules) shall govern these Terms and Your use of the Service.
            </p>
          </section>

          <section className="mt-8" id="disputes">
            <h2>Disputes Resolution</h2>
            <p>
              If You have a dispute about the Service, you agree to first try to resolve it informally by contacting the Company.
            </p>
            <p>
              EU users will benefit from mandatory provisions of their country of residence; US users must comply with applicable US laws, including export restrictions.
            </p>
          </section>

          <section className="mt-8" id="severability">
            <h2>Severability and Waiver</h2>
            <p>
              If any provision is held invalid or unenforceable, it will be revised to the greatest extent possible and the remaining provisions will remain in effect.
            </p>
            <p>
              Waiver of any breach does not constitute a waiver of subsequent breaches.
            </p>
          </section>

          <section className="mt-8" id="changes">
            <h2>Changes to These Terms</h2>
            <p>
              We may modify these Terms at any time and will give notice for material changes. Continuing to use the Service means You accept the revised Terms.
            </p>
          </section>

          <section className="mt-8" id="contact">
            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms and Conditions, You can contact us:</p>
            <ul>
              <li>By email: <a href="mailto:binasadultcare@gmail.com">binasadultcare@gmail.com</a></li>
              <li>By visiting this page on our website: <a href="https://www.binaadultcare.com/contact" target="_blank" rel="noreferrer">https://www.binaadultcare.com/contact</a></li>
              <li>By phone: <a href="tel:+15107104392">5107104392</a></li>
            </ul>
          </section>

          <div className="mt-8">
            <a href="#top" className="text-sm text-muted-foreground hover:underline">Back to top</a>
          </div>
        </article>
      </div>
    </div>
  );
}