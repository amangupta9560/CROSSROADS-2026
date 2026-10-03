// import { useState, useEffect, useRef } from "react";
// import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

// const Contact = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formSuccess, setFormSuccess] = useState(false);
//   const formRef = useRef(null);

//   useEffect(() => {
//     const observerOptions = {
//       threshold: 0.1,
//       rootMargin: '0px 0px -100px 0px'
//     };

//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach(entry => {
//         if (entry.isIntersecting) {
//           entry.target.style.opacity = '1';
//           entry.target.style.transform = 'translateY(0)';
//         }
//       });
//     }, observerOptions);

//     if (formRef.current) {
//       observer.observe(formRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     const formData = new FormData(e.target);
    
//     try {
//       const response = await fetch('https://getform.io/f/bgdllgva', {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         setFormSuccess(true);
//         e.target.reset();
//         setTimeout(() => setFormSuccess(false), 5000);
//       } else {
//         alert('Something went wrong. Please try again.');
//       }
//     } catch (error) {
//       alert('Error submitting form. Please try again.');
//       console.error('Form submission error:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className=" relative overflow-hidden" style={{ background: '#0a0a0a' }}>
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div style={{
//           position: 'absolute',
//           width: '500px',
//           height: '500px',
//           background: 'radial-gradient(circle, rgba(255,107,53,0.15) 0%, transparent 70%)',
//           top: '-10%',
//           right: '-10%',
//           borderRadius: '50%',
//           filter: 'blur(60px)',
//           animation: 'float 20s ease-in-out infinite'
//         }} />
//         <div style={{
//           position: 'absolute',
//           width: '400px',
//           height: '400px',
//           background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)',
//           bottom: '-5%',
//           left: '-5%',
//           borderRadius: '50%',
//           filter: 'blur(60px)',
//           animation: 'float 15s ease-in-out infinite reverse'
//         }} />
//       </div>

//       <style>
//         {`
//           @keyframes float {
//             0%, 100% { transform: translate(0, 0) scale(1); }
//             33% { transform: translate(30px, -30px) scale(1.1); }
//             66% { transform: translate(-20px, 20px) scale(0.9); }
//           }
          
//           @keyframes slideUp {
//             from {
//               opacity: 0;
//               transform: translateY(30px);
//             }
//             to {
//               opacity: 1;
//               transform: translateY(0);
//             }
//           }

//           .card-hover {
//             transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//           }

//           .card-hover:hover {
//             transform: translateY(-8px);
//           }

//           .input-field {
//             transition: all 0.3s ease;
//           }

//           .input-field:focus {
//             transform: translateY(-2px);
//             box-shadow: 0 8px 24px rgba(255,107,53,0.25);
//           }

//           .gradient-text {
//             background: linear-gradient(135deg, #ff6b35 0%, #f59e0b 50%, #a855f7 100%);
//             -webkit-background-clip: text;
//             -webkit-text-fill-color: transparent;
//             background-clip: text;
//           }

//           .glow-border {
//             position: relative;
//           }

//           .glow-border::before {
//             content: '';
//             position: absolute;
//             inset: -2px;
//             background: linear-gradient(135deg, #ff6b35, #a855f7);
//             border-radius: inherit;
//             opacity: 0;
//             transition: opacity 0.3s ease;
//             z-index: -1;
//           }

//           .glow-border:hover::before {
//             opacity: 0.5;
//           }
//         `}
//       </style>

//       <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 pt-26">
//         {/* Hero Section */}
//         <div className="text-center mb-20" style={{ animation: 'slideUp 0.8s ease-out' }}>
//           <div className="inline-block mb-4 px-6 py-2 rounded-full" style={{
//             background: 'rgba(255,107,53,0.1)',
//             border: '1px solid rgba(255,107,53,0.3)'
//           }}>
//             <span style={{ color: '#ff6b35', fontSize: '14px', fontWeight: '600', letterSpacing: '2px' }}>
//               CROSSROADS 2026 • February 27-28, 2026
//             </span>
//           </div>
          
//           <h1 className="gradient-text" style={{
//             fontSize: 'clamp(2.5rem, 8vw, 5rem)',
//             fontWeight: '900',
//             marginBottom: '1.5rem',
//             lineHeight: '1.1'
//           }}>
//             Contact Us
//           </h1>
          
//           <p style={{
//             color: '#9ca3af',
//             fontSize: 'clamp(1rem, 2vw, 1.25rem)',
//             maxWidth: '600px',
//             margin: '0 auto',
//             lineHeight: '1.6'
//           }}>
//             Join us for an unforgettable journey of innovation and technology
//           </p>
//         </div>

//         {/* Contact Cards - Changed to 2 columns */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 max-w-3xl mx-auto" style={{ animation: 'slideUp 0.8s ease-out 0.2s backwards' }}>
//           <a href="https://wa.me/9560472926" target="_blank" rel="noopener noreferrer" className="card-hover glow-border" style={{
//             background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)',
//             border: '1px solid rgba(34,197,94,0.3)',
//             borderRadius: '24px',
//             padding: '2rem',
//             textAlign: 'center'
//           }}>
//             <div style={{
//               width: '64px',
//               height: '64px',
//               background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
//               borderRadius: '20px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '0 auto 1rem',
//               boxShadow: '0 8px 24px rgba(34,197,94,0.3)'
//             }}>
//               <FaWhatsapp size={32} style={{ color: 'white' }} />
//             </div>
//             <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>WhatsApp</h3>
//             <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Chat with us instantly</p>
//           </a>

//           <a href="mailto:hietcrossroads@gmail.com" className="card-hover glow-border" style={{
//             background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(255,107,53,0.05) 100%)',
//             border: '1px solid rgba(255,107,53,0.3)',
//             borderRadius: '24px',
//             padding: '2rem',
//             textAlign: 'center'
//           }}>
//             <div style={{
//               width: '64px',
//               height: '64px',
//               background: 'linear-gradient(135deg, #ff6b35 0%, #f97316 100%)',
//               borderRadius: '20px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               margin: '0 auto 1rem',
//               boxShadow: '0 8px 24px rgba(255,107,53,0.3)'
//             }}>
//               <FaEnvelope size={28} style={{ color: 'white' }} />
//             </div>
//             <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Email</h3>
//             <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Drop us a message</p>
//           </a>
//         </div>

//         {/* Main Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//           {/* Registration Form */}
//           <div ref={formRef} className="lg:col-span-3" style={{
//             opacity: 0,
//             transform: 'translateY(30px)'
//           }}>
//             <div style={{
//               background: 'linear-gradient(135deg, rgba(255,107,53,0.05) 0%, rgba(168,85,247,0.05) 100%)',
//               border: '1px solid rgba(255,107,53,0.2)',
//               borderRadius: '32px',
//               padding: 'clamp(1.5rem, 4vw, 3rem)',
//               backdropFilter: 'blur(10px)'
//             }}>
//               <h2 className="gradient-text" style={{
//                 fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
//                 fontWeight: '800',
//                 marginBottom: '2rem'
//               }}>
//                 Contact Form
//               </h2>

//               {formSuccess && (
//                 <div style={{
//                   background: 'rgba(34,197,94,0.1)',
//                   border: '1px solid rgba(34,197,94,0.3)',
//                   borderRadius: '16px',
//                   padding: '1rem',
//                   marginBottom: '1.5rem',
//                   color: '#22c55e',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '0.75rem'
//                 }}>
//                   <FaPaperPlane size={20} />
//                   <span style={{ fontWeight: '600' }}>Registration successful! We'll contact you soon.</span>
//                 </div>
//               )}

//               <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
//                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
//                   <div>
//                     <label style={{ color: '#ff6b35', fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
//                       FULL NAME *
//                     </label>
//                     <input
//                       type="text"
//                       name="name"
//                       required
//                       placeholder="John Doe"
//                       className="input-field"
//                       style={{
//                         width: '100%',
//                         padding: '1rem',
//                         background: 'rgba(255,255,255,0.05)',
//                         border: '1px solid rgba(168,85,247,0.3)',
//                         borderRadius: '12px',
//                         color: 'white',
//                         fontSize: '1rem',
//                         outline: 'none'
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <label style={{ color: '#ff6b35', fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
//                       EMAIL *
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       required
//                       placeholder="john@example.com"
//                       className="input-field"
//                       style={{
//                         width: '100%',
//                         padding: '1rem',
//                         background: 'rgba(255,255,255,0.05)',
//                         border: '1px solid rgba(168,85,247,0.3)',
//                         borderRadius: '12px',
//                         color: 'white',
//                         fontSize: '1rem',
//                         outline: 'none'
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <label style={{ color: '#ff6b35', fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
//                       MOBILE *
//                     </label>
//                     <input
//                       type="tel"
//                       name="mobile"
//                       pattern="[6-9][0-9]{9}"
//                       required
//                       placeholder="9876543210"
//                       className="input-field"
//                       style={{
//                         width: '100%',
//                         padding: '1rem',
//                         background: 'rgba(255,255,255,0.05)',
//                         border: '1px solid rgba(168,85,247,0.3)',
//                         borderRadius: '12px',
//                         color: 'white',
//                         fontSize: '1rem',
//                         outline: 'none'
//                       }}
//                     />
//                   </div>

//                   <div>
//                     <label style={{ color: '#ff6b35', fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
//                       BRANCH *
//                     </label>
//                     <select
//                       name="branch"
//                       required
//                       className="input-field"
//                       style={{
//                         width: '100%',
//                         padding: '1rem',
//                         background: 'rgba(255,255,255,0.05)',
//                         border: '1px solid rgba(168,85,247,0.3)',
//                         borderRadius: '12px',
//                         color: 'white',
//                         fontSize: '1rem',
//                         outline: 'none',
//                         cursor: 'pointer'
//                       }}
//                     >
//                       <option value="" style={{ background: '#1a1a1a' }}>Select Branch</option>
//                       <option value="CSE" style={{ background: '#1a1a1a' }}>CSE</option>
//                       <option value="IT" style={{ background: '#1a1a1a' }}>IT</option>
//                       <option value="ECE" style={{ background: '#1a1a1a' }}>ECE</option>
//                       <option value="EE" style={{ background: '#1a1a1a' }}>EE</option>
//                       <option value="ME" style={{ background: '#1a1a1a' }}>ME</option>
//                       <option value="BCA" style={{ background: '#1a1a1a' }}>BCA</option>
//                       <option value="BBA" style={{ background: '#1a1a1a' }}>BBA</option>
//                       <option value="MBA" style={{ background: '#1a1a1a' }}>MBA</option>
//                       <option value="MCA" style={{ background: '#1a1a1a' }}>MCA</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div>
//                   <label style={{ color: '#ff6b35', fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
//                     MESSAGE *
//                   </label>
//                   <textarea
//                     name="message"
//                     required
//                     rows="4"
//                     placeholder="Tell us about your interest..."
//                     className="input-field"
//                     style={{
//                       width: '100%',
//                       padding: '1rem',
//                       background: 'rgba(255,255,255,0.05)',
//                       border: '1px solid rgba(168,85,247,0.3)',
//                       borderRadius: '12px',
//                       color: 'white',
//                       fontSize: '1rem',
//                       outline: 'none',
//                       resize: 'vertical'
//                     }}
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   style={{
//                     background: isSubmitting ? 'rgba(168,85,247,0.3)' : 'linear-gradient(135deg, #ff6b35 0%, #a855f7 100%)',
//                     color: 'white',
//                     padding: '1.25rem',
//                     borderRadius: '12px',
//                     border: 'none',
//                     fontSize: '1.125rem',
//                     fontWeight: '700',
//                     cursor: isSubmitting ? 'not-allowed' : 'pointer',
//                     transition: 'all 0.3s ease',
//                     boxShadow: isSubmitting ? 'none' : '0 8px 24px rgba(255,107,53,0.3)',
//                     transform: isSubmitting ? 'scale(0.98)' : 'scale(1)'
//                   }}
//                 >
//                   {isSubmitting ? 'SUBMITTING...' : 'SUBMIT CONTACT FORM'}
//                 </button>
//               </form>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Location */}
//             <div style={{
//               background: 'linear-gradient(135deg, rgba(255,107,53,0.05) 0%, rgba(168,85,247,0.05) 100%)',
//               border: '1px solid rgba(255,107,53,0.2)',
//               borderRadius: '32px',
//               padding: '2rem'
//             }}>
//               <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
//                 <div style={{
//                   width: '48px',
//                   height: '48px',
//                   background: 'linear-gradient(135deg, #ff6b35 0%, #f97316 100%)',
//                   borderRadius: '12px',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   flexShrink: 0
//                 }}>
//                   <FaMapMarkerAlt size={20} style={{ color: 'white' }} />
//                 </div>
//                 <div>
//                   <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
//                     Visit Us
//                   </h3>
//                   <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: '1.6' }}>
//                     Plot No. 766, 26th KM Milestone, NH-9<br />
//                     Ghaziabad, Uttar Pradesh – 201015
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Map */}
//             <div style={{
//               background: 'rgba(255,255,255,0.02)',
//               border: '1px solid rgba(168,85,247,0.2)',
//               borderRadius: '32px',
//               overflow: 'hidden',
//               height: '400px'
//             }}>
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.545251972305!2d77.49128877566565!3d28.673331882226368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf2c4cac27f99%3A0xd9961659aee6d5b2!2sHi-Tech%20Institute%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1739723721387!5m2!1sen!2sin"
//                 width="100%"
//                 height="100%"
//                 style={{ border: 0 }}
//                 allowFullScreen
//                 loading="lazy"
//                 referrerPolicy="no-referrer-when-downgrade"
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Contact;
import { useState, useEffect, useRef } from "react";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('https://forminit.com/f/azygdkgb', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setFormSuccess(true);
        e.target.reset();
        setTimeout(() => setFormSuccess(false), 5000);
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Error submitting form. Please try again.');
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(20,184,166,0.2) 0%, transparent 70%)',
          top: '-10%',
          right: '-10%',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 20s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)',
          bottom: '-5%',
          left: '-5%',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'float 15s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          animation: 'float 25s ease-in-out infinite'
        }} />
      </div>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -30px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .card-hover {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .card-hover:hover {
            transform: translateY(-8px);
          }

          .input-field {
            transition: all 0.3s ease;
          }

          .input-field:focus {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(20,184,166,0.35);
          }

          .gradient-text {
            background: linear-gradient(135deg, #14b8a6 0%, #ffffff 50%, #3b82f6 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .glow-border {
            position: relative;
          }

          .glow-border::before {
            content: '';
            position: absolute;
            inset: -2px;
            background: linear-gradient(135deg, #14b8a6, #3b82f6);
            border-radius: inherit;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
          }

          .glow-border:hover::before {
            opacity: 0.5;
          }
        `}
      </style>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 pt-26">
        {/* Hero Section */}
        <div className="text-center mb-20" style={{ animation: 'slideUp 0.8s ease-out' }}>
          <div className="inline-block mb-4 px-6 py-2 rounded-full" style={{
            background: 'rgba(20,184,166,0.15)',
            border: '1px solid rgba(20,184,166,0.4)'
          }}>
            <span style={{ color: '#14b8a6', fontSize: '14px', fontWeight: '600', letterSpacing: '2px' }}>
              CROSSROADS 2026 • November 28-29, 2026
            </span>
          </div>
          
          <h1 className="gradient-text" style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            fontWeight: '900',
            marginBottom: '1.5rem',
            lineHeight: '1.1'
          }}>
            Contact Us
          </h1>
          
          <p style={{
            color: '#cbd5e1',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Join us for an unforgettable journey of innovation and technology
          </p>
        </div>

        {/* Contact Cards - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 max-w-3xl mx-auto" style={{ animation: 'slideUp 0.8s ease-out 0.2s backwards' }}>
          <a href="https://wa.me/9560472926" target="_blank" rel="noopener noreferrer" className="card-hover glow-border" style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(34,197,94,0.05) 100%)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '24px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 24px rgba(34,197,94,0.3)'
            }}>
              <FaWhatsapp size={32} style={{ color: 'white' }} />
            </div>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>WhatsApp</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Chat with us instantly</p>
          </a>

          <a href="mailto:hietcrossroads@gmail.com" className="card-hover glow-border" style={{
            background: 'linear-gradient(135deg, rgba(20,184,166,0.1) 0%, rgba(20,184,166,0.05) 100%)',
            border: '1px solid rgba(20,184,166,0.3)',
            borderRadius: '24px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 24px rgba(20,184,166,0.3)'
            }}>
              <FaEnvelope size={28} style={{ color: 'white' }} />
            </div>
            <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Email</h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem' }}>Drop us a message</p>
          </a>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Registration Form */}
          <div ref={formRef} className="lg:col-span-3" style={{
            opacity: 0,
            transform: 'translateY(30px)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(59,130,246,0.08) 100%)',
              border: '1px solid rgba(20,184,166,0.3)',
              borderRadius: '32px',
              padding: 'clamp(1.5rem, 4vw, 3rem)',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 className="gradient-text" style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: '800',
                marginBottom: '2rem'
              }}>
                Contact Form
              </h2>

              {formSuccess && (
                <div style={{
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  borderRadius: '16px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  color: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <FaPaperPlane size={20} />
                  <span style={{ fontWeight: '600' }}>Registration successful! We'll contact you soon.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div>
                    <label style={{ color: '#14b8a6', fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="John Doe"
                      className="input-field"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#14b8a6', fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                      EMAIL *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      className="input-field"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#14b8a6', fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                      MOBILE *
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      pattern="[6-9][0-9]{9}"
                      required
                      placeholder="9876543210"
                      className="input-field"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#14b8a6', fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                      BRANCH *
                    </label>
                    <select
                      name="branch"
                      required
                      className="input-field"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '12px',
                        color: 'white',
                        fontSize: '1rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="" style={{ background: '#1e293b' }}>Select Branch</option>
                      <option value="CSE" style={{ background: '#1e293b' }}>CSE</option>
                      <option value="IT" style={{ background: '#1e293b' }}>IT</option>
                      <option value="ECE" style={{ background: '#1e293b' }}>ECE</option>
                      <option value="EE" style={{ background: '#1e293b' }}>EE</option>
                      <option value="ME" style={{ background: '#1e293b' }}>ME</option>
                      <option value="BCA" style={{ background: '#1e293b' }}>BCA</option>
                      <option value="BBA" style={{ background: '#1e293b' }}>BBA</option>
                      <option value="MBA" style={{ background: '#1e293b' }}>MBA</option>
                      <option value="MCA" style={{ background: '#1e293b' }}>MCA</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ color: '#14b8a6', fontSize: '0.875rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>
                    MESSAGE *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    placeholder="Tell us about your interest..."
                    className="input-field"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: isSubmitting ? 'rgba(59,130,246,0.3)' : 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
                    color: 'white',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '1.125rem',
                    fontWeight: '700',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: isSubmitting ? 'none' : '0 8px 24px rgba(20,184,166,0.4)',
                    transform: isSubmitting ? 'scale(0.98)' : 'scale(1)'
                  }}
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT CONTACT FORM'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Location */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(59,130,246,0.08) 100%)',
              border: '1px solid rgba(20,184,166,0.3)',
              borderRadius: '32px',
              padding: '2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FaMapMarkerAlt size={20} style={{ color: 'white' }} />
                </div>
                <div>
                  <h3 style={{ color: 'white', fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    Visit Us
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.6' }}>
                    Plot No. 766, 26th KM Milestone, NH-9<br />
                    Ghaziabad, Uttar Pradesh – 201015
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(59,130,246,0.3)',
              borderRadius: '32px',
              overflow: 'hidden',
              height: '400px'
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.545251972305!2d77.49128877566565!3d28.673331882226368!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf2c4cac27f99%3A0xd9961659aee6d5b2!2sHi-Tech%20Institute%20of%20Engineering%20%26%20Technology!5e0!3m2!1sen!2sin!4v1739723721387!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
