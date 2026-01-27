import { SEO } from '../components/SEO';

export default function PrivacyPolicy() {
  return (
    <div className="container-custom section-padding">
      <SEO title="Privacy Policy" description="Privacy Policy for Bina Adult Care" />

      <div className="md:grid md:grid-cols-4 gap-10">
        {/* Table of contents */}
        <nav className="hidden md:block md:col-span-1 sticky top-24">
          <div className="prose text-sm text-gray-700 dark:text-gray-300">
            <h4>On this page</h4>
            <ul className="space-y-2">
              <li><a href="#interpretation" className="hover:underline">Interpretation & Definitions</a></li>
              <li><a href="#data" className="hover:underline">Collecting & Using Data</a></li>
              <li><a href="#cookies" className="hover:underline">Tracking & Cookies</a></li>
              <li><a href="#uses" className="hover:underline">Uses of Data</a></li>
              <li><a href="#retention" className="hover:underline">Retention</a></li>
              <li><a href="#transfer" className="hover:underline">Transfer</a></li>
              <li><a href="#delete" className="hover:underline">Delete Data</a></li>
              <li><a href="#disclosure" className="hover:underline">Disclosure</a></li>
              <li><a href="#security" className="hover:underline">Security</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </nav>

        <article className="prose max-w-none text-gray-800 dark:text-gray-100 md:col-span-3">
          <header>
            <h1>Privacy Policy for binaadultcare</h1>
            <p className="mt-1 text-sm text-muted-foreground"><strong>Last updated:</strong> January 27, 2026</p>
          </header>

          <section className="mt-6" id="intro">
            <p>
              This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
            </p>

            <p>
              We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mt-8" id="interpretation">
            <h2>Interpretation and Definitions</h2>

            <h3>Interpretation</h3>
            <p>
              Words with initial capital letters have specific meanings defined below. Definitions apply equally in singular and plural.
            </p>

            <h3>Definitions</h3>
            <ul>
              <li><strong>Account</strong> — a unique account created for You to access our Service or parts of our Service.</li>
              <li><strong>Affiliate</strong> — an entity that controls, is controlled by, or is under common control with a party.</li>
              <li><strong>Company</strong> — referred to as "the Company", "We", "Us" or "Our" in this Privacy Policy and refers to binaadultcare, 5667 San Pablo Dam Rd, El Sobrante, CA 94803, USA.</li>
              <li><strong>Cookies</strong> — small files placed on Your device by a website.</li>
              <li><strong>Country</strong> — California, United States.</li>
              <li><strong>Device</strong> — any device that can access the Service.</li>
              <li><strong>Personal Data</strong> (or "Personal Information") — any information that relates to an identified or identifiable individual.</li>
              <li><strong>Service</strong> — the Website.</li>
              <li><strong>Service Provider</strong> — third-party companies or individuals who process data on Our behalf.</li>
              <li><strong>Usage Data</strong> — data collected automatically (e.g., duration of a page visit).</li>
              <li><strong>Website</strong> — binaadultcare, accessible from https://www.binaadultcare.com/.</li>
              <li><strong>You</strong> — the individual accessing or using the Service.</li>
            </ul>
          </section>

          <section className="mt-8" id="data">
            <h2>Collecting and Using Your Personal Data</h2>

            <h3>Types of Data Collected</h3>
            <h4>Personal Data</h4>
            <p>While using Our Service, We may ask You to provide certain personally identifiable information used to contact or identify You. This may include:</p>
            <ul>
              <li>Email address</li>
              <li>First and last name</li>
              <li>Phone number</li>
              <li>Usage Data</li>
            </ul>

            <p>
              Usage Data may include Your Device's IP address, browser type/version, pages visited, timestamps, and other diagnostic data.
            </p>
          </section>

          <section className="mt-8" id="cookies">
            <h2>Tracking Technologies and Cookies</h2>
            <p>
              We use Cookies and similar technologies (beacons, tags, scripts) to track activity and improve Our Service. These may include:
            </p>
            <ul>
              <li>Cookies or Browser Cookies</li>
              <li>Web Beacons</li>
            </ul>

            <p>
              Cookies can be Persistent or Session-based. Where required by law, non-essential cookies (analytics, advertising, remarketing) are used only with Your consent.
            </p>
          </section>

          <section className="mt-8" id="uses">
            <h2>Uses of Your Personal Data</h2>
            <ul>
              <li>To provide and maintain Our Service.</li>
              <li>To manage Your Account and provide access to features.</li>
              <li>For contract performance and order processing.</li>
              <li>To contact You about updates or support.</li>
              <li>To send marketing messages unless You opt out.</li>
              <li>To manage Your requests and support inquiries.</li>
              <li>For business transfers and other legal purposes.</li>
            </ul>
          </section>

          <section className="mt-8" id="retention">
            <h2>Retention of Your Personal Data</h2>
            <p>
              We retain Personal Data only as long as necessary for the purposes described and to comply with legal obligations. Example retention periods:
            </p>
            <ul>
              <li>User accounts: duration of relationship + up to 24 months.</li>
              <li>Support records: up to 24 months after closure.</li>
              <li>Analytics data: up to 24 months for trend analysis.</li>
            </ul>
          </section>

          <section className="mt-8" id="transfer">
            <h2>Transfer of Your Personal Data</h2>
            <p>
              Your data may be processed in locations outside Your jurisdiction. Where required, We apply appropriate safeguards for cross-border transfers.
            </p>
          </section>

          <section className="mt-8" id="delete">
            <h2>Delete Your Personal Data</h2>
            <p>
              You may request deletion of Your Personal Data. We will comply unless retention is required for legal reasons.
            </p>
          </section>

          <section className="mt-8" id="disclosure">
            <h2>Disclosure of Your Personal Data</h2>
            <p>We may disclose data to Service Providers, affiliates, business partners, or in connection with business transfers, and with Your consent.</p>
          </section>

          <section className="mt-8" id="security">
            <h2>Security of Your Personal Data</h2>
            <p>
              We use commercially reasonable measures to protect Your data, but no method is 100% secure.
            </p>
          </section>

          <section className="mt-8" id="children">
            <h2>Children's Privacy</h2>
            <p>
              Our Service does not target children under 16 and we do not knowingly collect data from them.
            </p>
          </section>

          <section className="mt-8" id="links">
            <h2>Links to Other Websites</h2>
            <p>
              Our Service may contain links to third-party sites; we are not responsible for their policies.
            </p>
          </section>

          <section className="mt-8" id="changes">
            <h2>Changes to this Privacy Policy</h2>
            <p>
              We may update this policy and will post changes here with the updated date.
            </p>
          </section>

          <section className="mt-8" id="contact">
            <h2>Contact Us</h2>
            <p>If you have questions, please contact us:</p>
            <ul>
              <li>By email: <a href="mailto:binasadultcare@gmail.com">binasadultcare@gmail.com</a></li>
              <li>By visiting: <a href="https://www.binaadultcare.com/" target="_blank" rel="noreferrer">https://www.binaadultcare.com/</a></li>
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
