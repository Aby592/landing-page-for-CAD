/**
 * ArcSphere Studio - Interactive Scripting
 * Features: On-page contact form, smooth scrolling CTAs, native modal controls, responsive navigation, toast notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const contactBtn = document.getElementById('contactBtn');
  const mobileContactBtn = document.getElementById('mobileContactBtn');
  const bookConsultationBtn = document.getElementById('bookConsultationBtn');
  const servicesQuoteBtn = document.getElementById('servicesQuoteBtn');
  const viewProjectsBtn = document.getElementById('viewProjectsBtn');
  const consultationModal = document.getElementById('consultationModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const consultationForm = document.getElementById('consultationForm');
  const onpageContactForm = document.getElementById('onpageContactForm');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Smooth scroll to contact section utility
  const scrollToContact = (e) => {
    if (e) e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      const firstInput = document.getElementById('onpageClientName');
      if (firstInput) setTimeout(() => firstInput.focus(), 600);
    }
  };

  // Open Modal function
  const openModal = () => {
    if (consultationModal) {
      consultationModal.showModal();
      document.body.style.overflow = 'hidden';
    }
  };

  // Close Modal function
  const closeModal = () => {
    if (consultationModal) {
      consultationModal.close();
      document.body.style.overflow = '';
    }
  };

  // Wire CTA buttons to scroll to contact section
  if (contactBtn) contactBtn.addEventListener('click', scrollToContact);
  if (mobileContactBtn) {
    mobileContactBtn.addEventListener('click', (e) => {
      toggleMobileMenu(false);
      scrollToContact(e);
    });
  }
  if (bookConsultationBtn) bookConsultationBtn.addEventListener('click', scrollToContact);
  if (servicesQuoteBtn) servicesQuoteBtn.addEventListener('click', scrollToContact);

  // Auto-open modal on page load
  setTimeout(() => {
    openModal();
  }, 400);

  // Close Modal triggers
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  if (consultationModal) {
    consultationModal.addEventListener('click', (e) => {
      const dialogDimensions = consultationModal.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        closeModal();
      }
    });

    // Restore scroll on Escape key
    consultationModal.addEventListener('close', () => {
      document.body.style.overflow = '';
    });
  }

  // Ensure select placeholder color is consistent across mobile & desktop browsers
  const quoteSelects = document.querySelectorAll('.quote-select');
  quoteSelects.forEach((select) => {
    const syncColor = () => {
      if (!select.value) {
        select.style.color = '#6E6961';
      } else {
        select.style.color = '#23201D';
      }
    };
    select.addEventListener('change', syncColor);
    syncColor();
  });

  // Toast notification utility
  const showToast = (message, duration = 4000) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // Email submission helper sending to projects@c-design.in
      async function sendProjectInquiry(formData, submitBtn, formElement, isModal = false) {
        const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit Request';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending...';
          submitBtn.style.opacity = '0.7';
          submitBtn.style.cursor = 'not-allowed';
        }

        const name = formData.get('clientName') || formData.get('name') || 'Valued Client';
        const phone = formData.get('clientPhone') || formData.get('mobile') || '';
        const email = formData.get('clientEmail') || formData.get('email') || '';
        const service = formData.get('servicesNeeded') || formData.get('projectType') || 'Architectural Services';
        const message = formData.get('message') || '';

        // Prepare submission payload for FormSubmit to projects@c-design.in
        const payload = new FormData();
        payload.append('Name', name);
        payload.append('Phone Number', phone);
        payload.append('Email', email);
        payload.append('Project Type', service);
        payload.append('Message', message);
        payload.append('_subject', `New Project Inquiry: ${name} - ${service}`);
        payload.append('_template', 'table');
        payload.append('_captcha', 'false');
        payload.append('_replyto', email);

        const fileInput = formElement ? formElement.querySelector('input[type="file"]') : null;
        if (fileInput && fileInput.files && fileInput.files[0]) {
          payload.append('Project File', fileInput.files[0]);
        }

        try {
          const response = await fetch('https://formsubmit.co/ajax/projects@c-design.in', {
            method: 'POST',
            body: payload,
            headers: {
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            if (formElement) formElement.reset();
            if (isModal) closeModal();
            showToast(`Thank you, ${name}! Your inquiry has been sent to projects@c-design.in.`);
          } else {
            throw new Error('Form submission error');
          }
        } catch (err) {
          console.warn('Direct submission error, opening mailto fallback:', err);
          const subject = encodeURIComponent(`Project Quote Request - ${name} (${service})`);
          const body = encodeURIComponent(
            `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nProject Type: ${service}\n\nMessage / Scope:\n${message}`
          );
          window.open(`mailto:projects@c-design.in?subject=${subject}&body=${body}`, '_blank');
          if (formElement) formElement.reset();
          if (isModal) closeModal();
          showToast(`Thank you, ${name}. Your email to projects@c-design.in is ready.`);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '';
            submitBtn.style.cursor = '';
          }
        }
      }

      // On-page Form submission handler
      window.handleOnpageFormSubmit = async () => {
        if (!onpageContactForm) return;
        const submitBtn = onpageContactForm.querySelector('button[type="submit"]');
        const formData = new FormData(onpageContactForm);
        await sendProjectInquiry(formData, submitBtn, onpageContactForm, false);
      };

      // Modal Form submission handler
      window.handleFormSubmit = async () => {
        if (!consultationForm) return;
        const submitBtn = consultationForm.querySelector('button[type="submit"]');
        const formData = new FormData(consultationForm);
        await sendProjectInquiry(formData, submitBtn, consultationForm, true);
      };

  // View projects CTA feedback
  if (viewProjectsBtn) {
    viewProjectsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Loading ArcSphere Studio curated portfolio...');
    });
  }

  // Mobile menu toggle
  const toggleMobileMenu = (forceState) => {
    if (!mobileNav || !menuToggle) return;
    const isExpanded = forceState !== undefined ? forceState : !mobileNav.classList.contains('active');
    mobileNav.classList.toggle('active', isExpanded);
    menuToggle.setAttribute('aria-expanded', isExpanded);
    mobileNav.setAttribute('aria-hidden', !isExpanded);
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => toggleMobileMenu());
  }
});
