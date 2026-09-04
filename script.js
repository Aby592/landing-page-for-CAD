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

  // Toast notification utility
  const showToast = (message, duration = 4000) => {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // On-page Form submission handler
  window.handleOnpageFormSubmit = () => {
    const nameInput = document.getElementById('onpageClientName');
    const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Valued Client';
    if (onpageContactForm) onpageContactForm.reset();
    showToast(`Thank you, ${name}. C-Design will contact you with your custom quote within 24 hours.`);
  };

  // Modal Form submission handler
  window.handleFormSubmit = () => {
    const nameInput = document.getElementById('clientName');
    const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Valued Client';
    closeModal();
    if (consultationForm) consultationForm.reset();
    showToast(`Thank you, ${name}. C-Design will contact you with your custom quote within 24 hours.`);
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
