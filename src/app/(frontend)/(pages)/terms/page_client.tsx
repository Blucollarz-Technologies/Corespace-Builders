'use client'

import { Gutter } from '@components/Gutter/index'
import React from 'react'

import classes from './page.module.scss'

export const TermsClientPage: React.FC = () => {
  return (
    <Gutter className={classes.termsWrap}>
      <div className="grid">
        <div className="cols-12 cols-m-8">
          <h2>Terms of Use</h2>
          <p>Effective as of September 30, 2026.</p>
          <p>
            These Terms of Use (“<b>Terms</b>”) govern your access to and use of the website and
            related online services operated by Corespace Builders (“<b>Corespace</b>,” “
            <b>we</b>,” “<b>us</b>,” or “<b>our</b>”), including corespacebuilders.com and any pages
            that link to these Terms (collectively, the “<b>Site</b>”).
          </p>
          <p>
            By accessing or using the Site, you agree to these Terms. If you do not agree, please do
            not use the Site.
          </p>

          <h3>Index</h3>
          <ul>
            <li>
              <a href="#services">Our services</a>
            </li>
            <li>
              <a href="#estimates">Estimates, quotes, and project guidance</a>
            </li>
            <li>
              <a href="#content">Site content and intellectual property</a>
            </li>
            <li>
              <a href="#submissions">Forms and enquiries</a>
            </li>
            <li>
              <a href="#acceptable-use">Acceptable use</a>
            </li>
            <li>
              <a href="#third-party">Third-party links and tools</a>
            </li>
            <li>
              <a href="#disclaimer">Disclaimer</a>
            </li>
            <li>
              <a href="#liability">Limitation of liability</a>
            </li>
            <li>
              <a href="#governing-law">Governing law</a>
            </li>
            <li>
              <a href="#changes">Changes to these Terms</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>

          <h3 id="services">Our services</h3>
          <p>
            Corespace Builders provides project planning, design coordination, and construction
            services focused on homes, villas, homestays, renovation, architecture, and interiors,
            with a strong focus on Coorg (Kodagu) and Karnataka.
          </p>
          <p>
            The Site is for general information and lead enquiry purposes. Using the Site does not
            by itself create a construction contract, consultancy engagement, or other binding
            project agreement between you and Corespace.
          </p>

          <h3 id="estimates">Estimates, quotes, and project guidance</h3>
          <p>
            Cost ranges, planning notes, timelines, and other guidance published on the Site are
            indicative only. Actual project cost and scope depend on site conditions, design choices,
            materials, approvals, labour, and other factors discussed during planning.
          </p>
          <p>
            Formal quotes, proposals, or contracts are issued separately in writing and apply only
            when accepted under their own terms.
          </p>

          <h3 id="content">Site content and intellectual property</h3>
          <p>
            Unless otherwise stated, text, branding, images, layouts, and other materials on the Site
            are owned by Corespace or used with permission. You may view and share Site pages for
            personal, non-commercial reference. You may not copy, scrape, republish, or commercially
            exploit Site content without our prior written consent.
          </p>

          <h3 id="submissions">Forms and enquiries</h3>
          <p>
            When you submit a form, request a cost estimate, or contact us through the Site or
            WhatsApp, you confirm that the information you provide is accurate and that we may use
            it to respond to your enquiry and discuss potential services. Our handling of personal
            information is described in our <a href="/privacy">Privacy Policy</a>.
          </p>

          <h3 id="acceptable-use">Acceptable use</h3>
          <p>You agree not to:</p>
          <ul>
            <li>use the Site in any way that is unlawful, harmful, or fraudulent</li>
            <li>attempt to disrupt, probe, or gain unauthorized access to the Site or related systems</li>
            <li>submit malware, spam, or misleading content</li>
            <li>misrepresent your identity or project details when contacting us</li>
          </ul>

          <h3 id="third-party">Third-party links and tools</h3>
          <p>
            The Site may link to third-party services such as WhatsApp, analytics, or payment and
            messaging tools. Those services are governed by their own terms and privacy policies. We
            are not responsible for third-party content or practices.
          </p>

          <h3 id="disclaimer">Disclaimer</h3>
          <p>
            The Site is provided on an “as is” and “as available” basis. To the fullest extent
            permitted by law, we disclaim warranties regarding accuracy, completeness, uninterrupted
            availability, or fitness for a particular purpose of Site content.
          </p>

          <h3 id="liability">Limitation of liability</h3>
          <p>
            To the fullest extent permitted by applicable law, Corespace Builders and its owners,
            employees, and agents shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the Site or reliance on Site
            content. Any project-related liability is governed only by the written agreement for that
            project, if any.
          </p>

          <h3 id="governing-law">Governing law</h3>
          <p>
            These Terms are governed by the laws of India. Courts in Karnataka shall have exclusive
            jurisdiction over disputes arising from these Terms or use of the Site, subject to any
            mandatory consumer protections that apply.
          </p>

          <h3 id="changes">Changes to these Terms</h3>
          <p>
            We may update these Terms from time to time. The “Effective as of” date above will be
            revised when changes are posted. Continued use of the Site after updates means you accept
            the revised Terms.
          </p>

          <h3 id="contact">Contact</h3>
          <p>
            Questions about these Terms can be sent through our{' '}
            <a href="/contact">Contact</a> page or via WhatsApp using the chat button on the Site.
          </p>
        </div>
      </div>
    </Gutter>
  )
}
