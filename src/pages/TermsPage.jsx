import Header from '../components/Header'
import Footer from '../components/Footer'
import SEO from '../components/SEO'

function TermsPage() {
  return (
    <div>
      <SEO
        title="Terms of Service"
        path="/terms"
        description="Terms of service for the Free365Key Microsoft 365 giveaway. Read about eligibility, entry rules, prize details, and legal terms."
      />
      <Header />

      <div className="container" style={{ padding: '60px 20px' }}>
        <div style={{ background: 'white', borderRadius: '20px', padding: '50px', maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ marginBottom: '30px' }}>Terms of Service</h1>
          <p style={{ color: '#666', marginBottom: '30px' }}>Last updated: {new Date().toLocaleDateString()}</p>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by these Terms
              of Service. If you do not agree to these terms, please do not use our website.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>2. Eligibility</h2>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Residency:</strong> Open to legal residents of the United States only</li>
              <li><strong>Age:</strong> Must be 18 years or older to participate</li>
              <li><strong>Limit:</strong> One registration per person/email address</li>
              <li>Employees of Free365Key and their immediate family members are not eligible</li>
              <li>Void where prohibited by law</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>3. How to Enter</h2>

            <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px' }}>Step 1: Register</h3>
            <p style={{ marginBottom: '15px' }}>
              Complete the registration form on our homepage with your name, email address, and phone number.
              You must provide accurate information. False or misleading information will result in disqualification.
            </p>

            <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px' }}>Step 2: Verify Your Email</h3>
            <p style={{ marginBottom: '15px' }}>
              After registering, you will receive a confirmation email. You must click the verification link
              to confirm your email address. <strong>Only verified registrations are eligible for the drawing.</strong>
            </p>

            <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px' }}>Step 3: Earn Bonus Entries (Optional)</h3>
            <p style={{ marginBottom: '10px' }}>
              After verifying your email, you may earn additional entries through:
            </p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Watching Ads:</strong> Each ad watched earns +2 bonus entries (valid for 3 monthly drawings)</li>
              <li><strong>Referring Friends:</strong> Each verified referral earns +10 bonus entries (valid for 6 monthly drawings)</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>4. Entry System & Weighting</h2>
            <p style={{ marginBottom: '15px' }}>
              Winners are selected using a weighted random drawing. Your chances of winning are proportional
              to your total entry count.
            </p>

            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '10px', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px' }}>Entry Values:</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px 0' }}><strong>Verified Email</strong></td>
                    <td style={{ padding: '10px 0', textAlign: 'right' }}>5 base entries (never expire)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px 0' }}><strong>Each Ad Watched</strong></td>
                    <td style={{ padding: '10px 0', textAlign: 'right' }}>+2 bonus entries (expire after 3 drawings)</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '10px 0' }}><strong>Each Verified Referral</strong></td>
                    <td style={{ padding: '10px 0', textAlign: 'right' }}>+10 bonus entries (expire after 6 drawings)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px 0' }}><strong>Unverified Registration</strong></td>
                    <td style={{ padding: '10px 0', textAlign: 'right' }}>0 entries (not eligible)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px' }}>Entry Validity:</h3>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Base entries (from email verification):</strong> Never expire. Once verified, your 5 base entries remain valid for all future drawings.</li>
              <li><strong>Ad bonus entries:</strong> Valid for the next 3 monthly drawings after being earned. After 3 drawings, ad bonus entries expire and are no longer counted.</li>
              <li><strong>Referral bonus entries:</strong> Valid for the next 6 monthly drawings after being earned. After 6 drawings, referral bonus entries expire and are no longer counted.</li>
            </ul>

            <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px' }}>Example:</h3>
            <p style={{ color: '#666' }}>
              If you watch an ad in December 2024, those 2 bonus entries will be valid for the January,
              February, and March 2025 drawings. Similarly, if you refer a friend in December 2024, those 10 bonus entries
              will be valid for the next 6 drawings (January through June 2025). To maintain bonus entries, you must
              continue watching ads and referring friends periodically.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>5. Referral Program</h2>
            <p style={{ marginBottom: '15px' }}>
              Participants may earn additional entries by referring new users to the giveaway.
            </p>

            <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px' }}>How Referrals Work:</h3>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8', marginBottom: '15px' }}>
              <li>After registering, each participant receives a unique referral link</li>
              <li>Share your referral link with friends via social media, email, or direct message</li>
              <li>When someone registers using your referral link AND verifies their email, you earn +10 bonus entries</li>
              <li>Referral entries are credited immediately upon the referred user's email verification</li>
              <li>Referral bonus entries are valid for 6 monthly drawings from when they are earned</li>
            </ul>

            <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px' }}>Referral Rules & Restrictions:</h3>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8', marginBottom: '15px' }}>
              <li>You cannot refer yourself or use multiple accounts to generate referral entries</li>
              <li>Referred users must be genuine, unique individuals who meet all eligibility requirements</li>
              <li>Referral entries are only awarded when the referred user successfully verifies their email address</li>
              <li>There is no limit to the number of people you can refer</li>
              <li>We reserve the right to void referral entries obtained through fraudulent or deceptive means</li>
              <li>Referral spam, fake accounts, or bot-generated referrals will result in disqualification</li>
            </ul>

            <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px' }}>Referral Tracking:</h3>
            <p style={{ color: '#666' }}>
              Your referral count and bonus entries are displayed on your dashboard after registration.
              You can view how many friends have signed up using your link and how many bonus entries you've earned.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>6. Drawing Schedule</h2>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>Drawings are held on the <strong>1st of each month</strong></li>
              <li>One winner is selected per monthly drawing</li>
              <li>Winners are selected randomly using a weighted algorithm based on total valid entries</li>
              <li>All eligible, verified registrations with at least one valid entry are included in the pool</li>
              <li>Previous winners are excluded from future drawings</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>7. Winner Notification & Prize Claiming</h2>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>Winners will be notified via the email address used during registration</li>
              <li>Winners must respond within <strong>30 days</strong> to claim their prize</li>
              <li>To receive the prize, winners must join our Cloud Solution Provider (CSP) reseller network</li>
              <li>This involves signing a simple cloud service agreement with our Microsoft partner organization</li>
              <li>If a winner does not respond within 30 days, the prize may be forfeited and a new winner selected</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>8. Prize Details</h2>
            <p style={{ marginBottom: '15px' }}>The prize is a <strong>Microsoft 365 Business Basic</strong> subscription for one user, valid for one month.</p>
            <p style={{ marginBottom: '10px' }}><strong>Prize includes:</strong></p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8', marginBottom: '15px' }}>
              <li>Web and mobile versions of Microsoft Office apps (Word, Excel, PowerPoint, Outlook)</li>
              <li>1 TB OneDrive cloud storage</li>
              <li>50 GB Exchange email mailbox</li>
              <li>SharePoint file sharing and collaboration</li>
              <li>Microsoft Forms, Lists, and Bookings</li>
            </ul>
            <p style={{ marginBottom: '10px' }}><strong>Prize does NOT include:</strong></p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>Desktop versions of Office applications</li>
              <li>Microsoft Teams</li>
            </ul>
            <p style={{ marginTop: '15px', color: '#666', fontSize: '0.9rem' }}>
              Prizes are non-transferable and cannot be exchanged for cash or other products.
              Approximate retail value: $6 USD.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>9. General Rules</h2>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>No purchase necessary to enter or win</li>
              <li>We reserve the right to disqualify any entry at our sole discretion</li>
              <li>We reserve the right to modify, suspend, or cancel the giveaway at any time</li>
              <li>By entering, you agree to these terms and our Privacy Policy</li>
              <li>All decisions regarding the giveaway are final</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>10. Additional Prize Terms</h2>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>No Cash Value:</strong> Prize has no cash value and cannot be redeemed for cash or cash equivalent</li>
              <li><strong>No Substitution:</strong> Prize cannot be substituted by winner; however, Sponsor reserves the right to substitute a prize of equal or greater value if the advertised prize becomes unavailable</li>
              <li><strong>Taxes:</strong> Winner is solely responsible for any federal, state, or local taxes on the prize</li>
              <li><strong>Limit:</strong> One prize per person and per household during any 12-month period</li>
              <li><strong>After Trial Ends:</strong> The subscription will expire after one month. No automatic renewal or billing will occur. Winner may choose to purchase a subscription at their own expense after the trial period</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>11. Release & Waiver</h2>
            <p style={{ marginBottom: '15px' }}>
              By participating in this giveaway, you agree to release, discharge, and hold harmless
              Free365Key, its officers, directors, employees, agents, and affiliates from any and all
              claims, damages, or liability arising from your participation in the giveaway or
              acceptance/use of the prize.
            </p>
            <p>
              By accepting the prize, winners grant Free365Key permission to use their first name
              and state of residence for promotional purposes without additional compensation,
              unless prohibited by law.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>12. Governing Law & Disputes</h2>
            <p style={{ marginBottom: '15px' }}>
              These terms shall be governed by and construed in accordance with the laws of the
              State of Oklahoma, without regard to conflict of law principles.
            </p>
            <p>
              Any dispute arising from this giveaway shall be resolved through binding arbitration
              in accordance with the rules of the American Arbitration Association. You agree to
              waive any right to participate in a class action lawsuit or class-wide arbitration.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>13. Force Majeure</h2>
            <p>
              If for any reason this giveaway is not capable of running as planned due to
              circumstances beyond our reasonable control, including but not limited to infection
              by computer virus, bugs, tampering, unauthorized intervention, fraud, technical
              failures, or any other causes which corrupt or affect the administration, security,
              fairness, integrity, or proper conduct of the giveaway, we reserve the right to
              cancel, terminate, modify, or suspend the giveaway.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>14. Microsoft Disclaimer</h2>
            <p>
              Microsoft 365 licenses provided through this giveaway are genuine and obtained through
              authorized Microsoft Cloud Solution Provider (CSP) channels. The licenses are subject
              to Microsoft's terms of service. Free365Key is not affiliated with, endorsed by, or
              sponsored by Microsoft Corporation. Microsoft and Microsoft 365 are trademarks of
              Microsoft Corporation.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>15. User Conduct</h2>
            <p style={{ marginBottom: '10px' }}>You agree not to:</p>
            <ul style={{ marginLeft: '20px', lineHeight: '1.8' }}>
              <li>Submit false or misleading information</li>
              <li>Create multiple accounts or registrations</li>
              <li>Use automated systems, bots, or scripts to submit entries or watch ads</li>
              <li>Interfere with the proper functioning of the website</li>
              <li>Attempt to manipulate the drawing or entry system</li>
              <li>Generate fake or fraudulent referrals using fictitious identities</li>
              <li>Spam referral links or engage in deceptive referral practices</li>
              <li>Create referral schemes with the intent to abuse the bonus entry system</li>
            </ul>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>16. Limitation of Liability</h2>
            <p>
              We shall not be liable for any indirect, incidental, special, consequential, or
              punitive damages arising out of your use of this website or participation in the
              giveaway. Our total liability shall not exceed the value of the prize.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>17. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the website constitutes acceptance
              of the modified terms. Material changes to the entry system or prize will be
              announced on the website.
            </p>
          </section>

          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '15px' }}>18. Contact</h2>
            <p>
              For questions about these terms or the giveaway, please use our{' '}
              <a href="/#contact" style={{ color: '#00a4ef' }}>
                contact form
              </a>{' '}
              and select "Legal" as the reason for your inquiry.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default TermsPage
