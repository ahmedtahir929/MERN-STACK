import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Async submission block hitting your explicit feedback endpoint
  const handleFeedbackSubmission = async (formData, resetCallback) => {
    try {
      setIsSubmitting(true);

      const response = await axios.post(
        'http://localhost:4000/api/contact/feedback',
        formData,
      );

      // Trigger dynamic toast popup from your server response payload message
      toast.success(
        response.data.message || 'Your message has been sent successfully!',
      );

      // Clear form inputs now that request resolved successfully
      resetCallback();
    } catch (err) {
      console.error('Contact processing failure:', err);
      toast.error(
        err.response?.data?.message ||
          'Failed to send your message. Please try again later.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen px-6 py-24"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* PAGE HEADER */}
      <div className="max-w-7xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Contact & Feedback
        </h1>
        <p style={{ color: 'var(--muted)' }}>
          We would love to hear your thoughts and suggestions to help us improve public services in Multan.
        </p>
      </div>

      {/* GRID CONTAINER */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">
        {/* LEFT PANEL COLUMN: MODULAR INJECTED INPUT GRID FORM */}
        <div className="relative">
          <ContactForm onSend={handleFeedbackSubmission} />

          {/* Optional Async Loading Interceptor Glass Overlay */}
          {isSubmitting && (
            <div className="absolute inset-0 bg-white/10 dark:bg-black/10 backdrop-blur-[1px] rounded-xl flex items-center justify-center pointer-events-none">
              <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL COLUMN: SYSTEM CONFIG DETAILS BOX */}
        <div
          className="p-6 rounded-xl shadow-sm space-y-6"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
          }}
        >
          <div>
            <h2 className="text-xl font-semibold mb-3">About SSPMC</h2>
            <p
              className="text-sm text-justify leading-relaxed mb-3 opacity-80"
              style={{ color: 'var(--text)' }}
            >
              The Smart Services & Public Management Console (SSPMC) is an online 
              portal created by the Multan district administration. It lets citizens 
              easily find and look up local facilities and services across the city.
            </p>
            <p
              className="text-sm leading-relaxed opacity-70"
              style={{ color: 'var(--muted)' }}
            >
              Our main goal is to make it simpler for citizens to connect with the 
              government, make public information clearer, and build a helpful, 
              easy-to-use directory of everyday city services.
            </p>
          </div>

          {/* CONTACT DETAILS MATRICES */}
          <div
            className="border-t pt-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <h3 className="font-bold text-sm mb-2">
              Our Office Details
            </h3>
            <p
              className="text-xs space-y-1.5 opacity-80 line-height-relaxed"
              style={{ color: 'var(--muted)' }}
            >
              📍 Multan District Headquarters, Punjab, Pakistan
              <br />
              📧 support@sspmc.pitb.gov.pk
              <br />
              📞 +92 (61) 9200051
            </p>
          </div>

          {/* PUBLIC UPGRADE ROADMAP ROADMAP SUGGESTION BOX */}
          <div
            className="border-t pt-4"
            style={{ borderColor: 'var(--border)' }}
          >
            <h3 className="font-bold text-sm mb-3">
              Future Updates We Are Working On
            </h3>
            <ul
              className="list-disc ml-5 space-y-2 text-xs opacity-80"
              style={{ color: 'var(--muted)' }}
            >
              <li>Showing real-time hospital bed availability logs</li>
              <li>
                Adding live maps to find emergency services instantly
              </li>
              <li>
                Providing digital tokens and certificates for park entry licensing
              </li>
              <li>
                Adding full Urdu and English language support across the portal
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;