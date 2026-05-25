document.addEventListener('DOMContentLoaded', () => {

    /* ── Hamburger menu toggle ── */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            hamburger.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
        });
        // Close menu when a nav link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('open');
                hamburger.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // For development/testing purposes, we can clear the localStorage to reset draft flags
    //localStorage.clear(); // Wipes out all saved draft flags instantly

    const btnContinue = document.getElementById('btn-continue');
    const btnStatus = document.getElementById('btn-status');
    const modalContinue = document.getElementById('modal-continue');
    const modalStatus = document.getElementById('modal-status');
    const closeBtns = document.querySelectorAll('.close-btn');

    if (btnContinue && modalContinue) {
        btnContinue.addEventListener('click', () => modalContinue.style.display = 'flex');
    }
    if (btnStatus && modalStatus) {
        btnStatus.addEventListener('click', () => modalStatus.style.display = 'flex');
    }
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    /* ==========================================================================
       ── NEW REGISTRATION ENTRY ROUTER ──
       ========================================================================== */
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            // Clears any old step numbers ONLY when starting completely fresh
            localStorage.removeItem('isDraftSaved');
            localStorage.removeItem('activeStepNum');
            
            window.location.href = 'registration.html';
        });
    }

    const submitContinue = document.getElementById('submit-continue');
    const submitStatus = document.getElementById('submit-status');
    const continueInput = document.getElementById('continue-input');
    const statusInput = document.getElementById('status-input');

    const VALID_SAMPLE_CODE = "8228DD1D3A";
    
    // --- SAVE DRAFT TRACKING STATE WITH PERSISTENT STORAGE ---
    let isDraftSaved = localStorage.getItem('isDraftSaved') === 'true';

    function validateField(inputElement) {
        const value = inputElement.value.trim();
        
        // Identify which interactive field is currently running validation
        const isContinueField = inputElement.id === 'continue-input';
        const isStatusField = inputElement.id === 'status-input';

        // Get references to our reusable exit modal elements to turn it into a warning popup
        const modalExitConfirm = document.getElementById('modal-exit-confirm');
        const exitModalText = document.getElementById('exit-modal-text');
        const btnConfirmExit = document.getElementById('btn-confirm-exit');
        const btnCancelExit = document.getElementById('btn-cancel-exit');

        // 1. Basic validation: check if the input is completely empty or an incorrect code
        if (value === "" || value !== VALID_SAMPLE_CODE) {
            inputElement.value = "";
            inputElement.classList.add('input-field-error');
            inputElement.placeholder = "Please input a valid code...";
            return false;
        }

        // 2. Continue Route check: Block if no active session draft exists
        if (isContinueField && !isDraftSaved) {
            inputElement.value = "";
            inputElement.classList.add('input-field-error');
            inputElement.placeholder = "No active draft found. Start a new form first!";
            
            if (modalExitConfirm && exitModalText && btnConfirmExit && btnCancelExit) {
                // Change modal layout to a friendly warning message
                modalExitConfirm.querySelector('.modal-header h3').textContent = "No Draft Found";
                exitModalText.innerHTML = `<strong>No active draft found for this reference code.</strong><br><br>Please click 'Start New Registration' to begin a completely fresh application profile.`;
                
                // Hide the "Yes, Leave" button and make "Stay Here" say "Close" instead
                btnConfirmExit.style.display = "none";
                btnCancelExit.textContent = "Close";
                btnCancelExit.className = "modal-submit btn-red"; // Make it look like a warning close button
                
                modalExitConfirm.style.display = 'flex';
            }
            return false;
        }

        // 3. Status Route check: Block lookup if no application record has been saved yet
        if (isStatusField && !isDraftSaved) {
            inputElement.value = "";
            inputElement.classList.add('input-field-error');
            inputElement.placeholder = "No tracking records found for this code!";
            
            if (modalExitConfirm && exitModalText && btnConfirmExit && btnCancelExit) {
                // Change modal layout to a tracking warning message
                modalExitConfirm.querySelector('.modal-header h3').textContent = "No Records Found";
                exitModalText.innerHTML = `<strong>No tracking logs found for this reference code.</strong><br><br>You must initiate a registration form and click 'Save Draft' or submit the application before tracking its progress status.`;
                
                // Hide the "Yes, Leave" button and make "Stay Here" say "Close" instead
                btnConfirmExit.style.display = "none";
                btnCancelExit.textContent = "Close";
                btnCancelExit.className = "modal-submit btn-red";
                
                modalExitConfirm.style.display = 'flex';
            }
            return false;
        }

        inputElement.classList.remove('input-field-error');
        return true;
    }

    function clearErrors() {
        [continueInput, statusInput].forEach(input => {
            if (input) {
                input.classList.remove('input-field-error');
                input.value = "";
            }
        });
    }

    if (submitContinue && continueInput) {
        submitContinue.addEventListener('click', () => {
            if (validateField(continueInput)) {
                // Check if there's a saved step bookmark, otherwise default to step 1
                const savedStep = localStorage.getItem('activeStepNum') || '1';
                window.location.href = `registration.html?step=${savedStep}`;
                clearErrors(); 
            }
        });
    }

    const modalStatusSuccess = document.getElementById('modal-status-success');
    const btnStatusProceed = document.getElementById('btn-status-proceed');
    const closeStatusSuccessModal = document.getElementById('close-status-success-modal');

    if (submitStatus && statusInput) {
        submitStatus.addEventListener('click', () => {
            if (validateField(statusInput)) {
                // Safely close the input modal card first
                const modalStatus = document.getElementById('modal-status');
                if (modalStatus) modalStatus.style.display = 'none';

                // Open your new branded success tracking modal panel
                if (modalStatusSuccess) {
                    modalStatusSuccess.style.display = 'flex';
                }
            }
        });
    }

    // Handle clicking the "Proceed to Tracking" button
    if (btnStatusProceed) {
        btnStatusProceed.addEventListener('click', () => {
            if (modalStatusSuccess) modalStatusSuccess.style.display = 'none';
            clearErrors();
        });
    }

    // Close button (X icon) handler for the success popup panel
    if (closeStatusSuccessModal) {
        closeStatusSuccessModal.addEventListener('click', () => {
            if (modalStatusSuccess) modalStatusSuccess.style.display = 'none';
            clearErrors();
        });
    }

    // Close the success panel if clicking outside on the dark background overlay
    window.addEventListener('click', (e) => {
        if (e.target === modalStatusSuccess) {
            modalStatusSuccess.style.display = 'none';
            clearErrors();
        }
    });

    if (continueInput && submitContinue) {
        continueInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitContinue.click();
            }
        });
    }

    if (statusInput && submitStatus) {
        statusInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                submitStatus.click();
            }
        });
    }

    const sidebarAnchors = document.querySelectorAll('.sidebar-anchor');
    const contentBlocks = document.querySelectorAll('.doc-content-block');
    
    let isClickScrolling = false;

    sidebarAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            isClickScrolling = true;
            sidebarAnchors.forEach(link => link.classList.remove('active-anchor'));
            this.classList.add('active-anchor');

            setTimeout(() => {
                isClickScrolling = false;
            }, 500);
        });
    });

    // --- STABILIZED MOBILE SIDEBAR INTERSECTION OBSERVER ---
    window.addEventListener('scroll', () => {
        if (isClickScrolling) return;

        let currentActiveId = "";
        
        const isMobileSize = window.innerWidth <= 960;
        const detectionThreshold = isMobileSize ? 280 : 160; 

        contentBlocks.forEach(block => {
            const rect = block.getBoundingClientRect();
            // Detects which panel header is crossing into view dynamically
            if (rect.top <= detectionThreshold) {
                currentActiveId = block.getAttribute('id');
            }
        });
        
        if (window.scrollY < 50) {
            currentActiveId = contentBlocks[0].getAttribute('id');
        }

        if (currentActiveId) {
            sidebarAnchors.forEach(anchor => {
                if (anchor.getAttribute('href') === `#${currentActiveId}`) {
                    anchor.classList.add('active-anchor');
                    
                    // ACCESSIBILITY ENHANCEMENT FOR MOBILE SYSTEM:
                    // Automatically scrolls the active tab option panel horizontally into focus 
                    // inside the tab system if it wraps out of view!
                    if (isMobileSize) {
                        anchor.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    }
                } else {
                    anchor.classList.remove('active-anchor');
                }
            });
        }
    });
    
    const btnFeedback = document.querySelector('.feedback-btn');
    const modalFeedback = document.getElementById('modal-feedback');
    const submitFeedback = document.getElementById('submit-feedback');
    
    if (btnFeedback && modalFeedback) {
        btnFeedback.addEventListener('click', () => {
            modalFeedback.style.display = 'flex';
        });
    }

    if (submitFeedback) {
        submitFeedback.addEventListener('click', () => {
            const nameField = document.getElementById('feedback-name');
            const commentField = document.getElementById('feedback-comments');

            if (commentField.value.trim() === "") {
                commentField.classList.add('input-field-error');
                commentField.placeholder = "Please enter your comments before submitting...";
            } else {
                commentField.classList.remove('input-field-error');
                alert("Thank you! Your feedback has been sent to Cheryl and the CSWDD team.");
                nameField.value = "";
                document.getElementById('feedback-contact').value = "";
                commentField.value = "";
                modalFeedback.style.display = 'none';
            }
        });
    }

    const wizardPanels = document.querySelectorAll('.form-wizard-panel');
    const stepIndicators = document.querySelectorAll('.step-tracker .step');
    const progressCircle = document.getElementById('wizard-progress-circle');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');

    function updateWizardProgress(targetStepNum) {
        // Save the current step number bookmark into the browser storage
        localStorage.setItem('activeStepNum', targetStepNum);

        wizardPanels.forEach(panel => panel.classList.remove('panel-active'));
        const activePanel = document.getElementById(`panel-step-${targetStepNum}`);
        if (activePanel) activePanel.classList.add('panel-active');

        stepIndicators.forEach(indicator => {
            const indStep = parseInt(indicator.getAttribute('data-step'));
            if (indStep === targetStepNum) {
                indicator.classList.add('step-active');
                indicator.style.opacity = "1";
            } else {
                indicator.classList.remove('step-active');
                indicator.style.opacity = "0.5";
            }
        });

        const percentValue = targetStepNum * 25;
        if (progressCircle) {
            progressCircle.textContent = `${percentValue}%`;
            progressCircle.style.background = `radial-gradient(closest-side, white 79%, transparent 80% 100%), conic-gradient(var(--card-green) ${percentValue}%, #EAECEF 0)`;
        }

        for (let i = 1; i <= 4; i++) {
            const sidebarItem = document.getElementById(`sidebar-step-${i}`);
            if (sidebarItem) {
                if (i === targetStepNum) {
                    sidebarItem.classList.add('active-p');
                } else {
                    sidebarItem.classList.remove('active-p');
                }
            }
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /* ==========================================================================
       ── DEEP-LINKING URL PARAMETER CHECK ──
       ========================================================================== */
    const urlParams = new URLSearchParams(window.location.search);
    const stepParam = urlParams.get('step');
    if (stepParam) {
        const targetStep = parseInt(stepParam);
        if (targetStep >= 1 && targetStep <= 4) {
            updateWizardProgress(targetStep);
        }
    }

    /* ==========================================================================
       ── LEAVE PAGE CONFIRMATION MODAL ──
       ========================================================================== */
    const backToHomeLink = document.querySelector('.back-link');
    const modalExitConfirm = document.getElementById('modal-exit-confirm');
    const exitModalText = document.getElementById('exit-modal-text');
    const btnConfirmExit = document.getElementById('btn-confirm-exit');
    const btnCancelExit = document.getElementById('btn-cancel-exit');
    const closeExitModal = document.getElementById('close-exit-modal');

    if (backToHomeLink && modalExitConfirm && exitModalText) {
        backToHomeLink.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            // RESET MODAL STRUCTURAL DEFAULTS FOR LEAVING PATHS
            modalExitConfirm.querySelector('.modal-header h3').textContent = "Leave Page?";
            btnConfirmExit.style.display = "block"; // Bring "Yes, Leave" back
            btnCancelExit.textContent = "Stay Here";
            btnCancelExit.className = "modal-submit btn-green"; // Reset color layout class
            
            // Choose friendly text based on whether they saved their draft
            if (!isDraftSaved) {
                exitModalText.innerHTML = `<strong>Warning: Your progress has not been saved yet!</strong><br><br>Are you sure you want to leave? Click 'Save Draft' near the progress tracker if you want to keep your information saved.`;
            } else {
                exitModalText.innerHTML = `<strong>Your draft is saved!</strong><br><br>You can finish your application whenever you return using your Reference Code: <strong>8228DD1D3A</strong>.<br><br>Go back to the homepage?`;
            }

            modalExitConfirm.style.display = 'flex';
        });
    }

    // If they click "Yes, Leave", send them home
    if (btnConfirmExit && backToHomeLink) {
        btnConfirmExit.addEventListener('click', () => {
            modalExitConfirm.style.display = 'none';
            window.location.href = backToHomeLink.getAttribute('href');
        });
    }

    // Close the popup if they click "Stay Here" or the "X" button
    [btnCancelExit, closeExitModal].forEach(closeBtn => {
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modalExitConfirm.style.display = 'none';
            });
        }
    });

    // Close the popup if they click outside the white box on the dark background
    window.addEventListener('click', (e) => {
        if (e.target === modalExitConfirm) {
            modalExitConfirm.style.display = 'none';
        }
    });

    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetNextStep = parseInt(btn.getAttribute('data-next'));
            const currentForm = btn.closest('.form-wizard-panel');
            if (!currentForm) return;

            const inputsInside = currentForm.querySelectorAll('input[required], select[required]');
            let panelIsValid = true;

            inputsInside.forEach(input => {
                if (!input.checkValidity()) {
                    input.reportValidity(); 
                    panelIsValid = false;
                }
            });

            // --- OUR NEW CHECK FOR STEP 2 START ---
            if (currentForm.getAttribute('id') === 'panel-step-2' && panelIsValid) {
                const checkedBoxes = currentForm.querySelectorAll('input[name="disability_types"]:checked');
                if (checkedBoxes.length === 0) {
                    alert("Error: You must check at least one type of disability category to proceed.");
                    panelIsValid = false;
                }
            }
            // --- OUR NEW CHECK FOR STEP 2 END ---

            if (panelIsValid) {
                updateWizardProgress(targetNextStep);
            }
        });
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetPrevStep = parseInt(btn.getAttribute('data-prev'));
            updateWizardProgress(targetPrevStep);
        });
    });

    const primaryFormAsset = document.getElementById('pwd-application-form');
    if (primaryFormAsset) {
        primaryFormAsset.addEventListener('submit', (e) => {
            e.preventDefault();
            alert("Application Form Packed Successfully! Sent to Persons with Disability Affairs Office (PDAO) for data review validation.");
            
            // Clear the draft and step bookmarks since the form is officially finished
            localStorage.removeItem('isDraftSaved');
            localStorage.removeItem('activeStepNum');
            
            window.location.href = "index.html";
        });
    }

    // ── FORGOT REFERENCE CODE INTERACTIVE FLOW ──
    const triggerForgotLinks = document.querySelectorAll('.forgot-code-link');
    const modalForgotCode = document.getElementById('modal-forgot-code');
    const forgotStepPhone = document.getElementById('forgot-step-phone');
    const forgotStepSuccess = document.getElementById('forgot-step-success');
    const forgotPhoneInput = document.getElementById('forgot-phone-input');
    const submitForgotPhone = document.getElementById('submit-forgot-phone');

    triggerForgotLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const activeModal = link.closest('.modal');
            const isFromStatus = activeModal && activeModal.id === 'modal-status';
            
            if (activeModal) activeModal.style.display = 'none';
            
            forgotStepPhone.style.display = 'block';
            forgotStepSuccess.style.display = 'none';
            if (forgotPhoneInput) {
                forgotPhoneInput.value = "";
                forgotPhoneInput.classList.remove('input-field-error');
                forgotPhoneInput.placeholder = "e.g. 09XXXXXXXXX";
            }
            
            // Dynamic Color Selection Theme
            if (isFromStatus) {
                forgotStepPhone.className = "modal-content modal-red";
                submitForgotPhone.className = "modal-submit btn-red";
            } else {
                forgotStepPhone.className = "modal-content modal-blue";
                submitForgotPhone.className = "modal-submit btn-blue";
            }
            
            if (modalForgotCode) modalForgotCode.style.display = 'flex';
        });
    });

    if (submitForgotPhone && forgotPhoneInput) {
        submitForgotPhone.addEventListener('click', () => {
            const phoneValue = forgotPhoneInput.value.trim();
            const phoneRegex = /^(09|\+639)\d{9}$/;

            if (!phoneRegex.test(phoneValue)) {
                forgotPhoneInput.classList.add('input-field-error');
                forgotPhoneInput.value = "";
                forgotPhoneInput.placeholder = "Please enter a valid 11-digit phone number...";
                return;
            }

            forgotPhoneInput.classList.remove('input-field-error');
            forgotStepPhone.style.display = 'none';
            forgotStepSuccess.style.display = 'block';
        });

        forgotPhoneInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitForgotPhone.click();
            }
        });
    }

    if (forgotPhoneInput) {
        forgotPhoneInput.addEventListener('input', () => {
            forgotPhoneInput.classList.remove('input-field-error');
        });
    }

   /* ==========================================================================
       ── SAVE DRAFT MODAL CONTROLS ──
       ========================================================================== */
    const btnSaveDraft = document.getElementById('btn-save-draft');
    const modalSaveDraft = document.getElementById('modal-save-draft');
    const draftStepPhone = document.getElementById('draft-step-phone');
    const draftStepSuccess = document.getElementById('draft-step-success');
    const draftPhoneInput = document.getElementById('draft-phone-input');
    const submitDraftPhone = document.getElementById('submit-draft-phone');
    const closeDraftModal = document.getElementById('close-draft-modal');
    const closeDraftSuccessModal = document.getElementById('close-draft-success-modal');

    if (btnSaveDraft && modalSaveDraft) {
        btnSaveDraft.onclick = () => {
            if (!isDraftSaved) {
                // FIRST TIME SAVING: Show the phone number input screen
                draftStepPhone.style.display = 'block';
                draftStepSuccess.style.display = 'none';
                if (draftPhoneInput) {
                    draftPhoneInput.value = "";
                    draftPhoneInput.classList.remove('input-field-error');
                    draftPhoneInput.placeholder = "e.g. 09XXXXXXXXX";
                }
                modalSaveDraft.style.display = 'flex';
            } else {
                // NEXT TIME SAVING: Skip the input screen and show the success screen
                draftStepPhone.style.display = 'none';
                draftStepSuccess.style.display = 'block';
                modalSaveDraft.style.display = 'flex';
            }
        };
    }

    // Handle clicking the "Save Draft" button inside the popup
    if (submitDraftPhone && draftPhoneInput) {
        submitDraftPhone.addEventListener('click', () => {
            const phoneValue = draftPhoneInput.value.trim();
            const phoneRegex = /^09\d{9}$/;

            if (!phoneRegex.test(phoneValue)) {
                draftPhoneInput.classList.add('input-field-error');
                draftPhoneInput.value = "";
                draftPhoneInput.placeholder = "Please enter a valid phone number...";
                return;
            }

            // Save the draft status flag in the browser storage
            isDraftSaved = true;
            localStorage.setItem('isDraftSaved', 'true');

            // Switch to the success screen
            draftStepPhone.style.display = 'none';
            draftStepSuccess.style.display = 'block';
        });

        // Let users press Enter to submit their number
        draftPhoneInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitDraftPhone.click();
            }
        });
    }

    // Remove red highlight errors when typing
    if (draftPhoneInput) {
        draftPhoneInput.addEventListener('input', () => {
            draftPhoneInput.classList.remove('input-field-error');
        });
    }

    // Close buttons handler (the "X" icon)
    [closeDraftModal, closeDraftSuccessModal].forEach(closeBtn => {
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modalSaveDraft.style.display = 'none';
            });
        }
    });

    // Close the popup if clicking anywhere outside the white box
    window.addEventListener('click', (e) => {
        if (e.target === modalSaveDraft) {
            modalSaveDraft.style.display = 'none';
        }
    });

    /* ==========================================================================
       ── AUTOMATIC INPUT DATA RETENTION ENGINE ──
       ========================================================================== */
    const mainForm = document.getElementById('pwd-application-form');

    // 1. CONDITIONAL LOAD: Only restore data if explicitly returning via the 'Continue' route
    if (mainForm) {
        const urlParamsCheck = new URLSearchParams(window.location.search);
        const comingFromContinueRoute = urlParamsCheck.has('step');

        if (comingFromContinueRoute) {
            // User clicked "Continue Existing Application" -> Restore their data
            const savedData = JSON.parse(localStorage.getItem('pwdFormDraftData')) || {};
            
            Object.keys(savedData).forEach(fieldId => {
                const inputField = document.getElementById(fieldId);
                if (inputField) {
                    if (inputField.type === 'checkbox') {
                        inputField.checked = savedData[fieldId];
                    } else if (inputField.type === 'radio') {
                        const radioOption = mainForm.querySelector(`input[name="${inputField.name}"][value="${savedData[fieldId]}"]`);
                        if (radioOption) radioOption.checked = true;
                    } else {
                        inputField.value = savedData[fieldId];
                    }
                }
            });
        } else {
            // User clicked "Start New Registration" -> Clear old logs for a fresh form
            localStorage.removeItem('pwdFormDraftData');
            localStorage.removeItem('isDraftSaved');
            localStorage.removeItem('activeStepNum');
        }

        // 2. SAVE DATA ON THE FLY: Listen for inputs across the entire form
        mainForm.addEventListener('input', (e) => {
            const target = e.target;
            if (!target.id && !target.name) return;

            let currentDraft = JSON.parse(localStorage.getItem('pwdFormDraftData')) || {};

            if (target.type === 'checkbox') {
                currentDraft[target.id || target.name] = target.checked;
            } else if (target.type === 'radio') {
                currentDraft[target.name] = target.value;
            } else {
                currentDraft[target.id] = target.value;
            }

            localStorage.setItem('pwdFormDraftData', JSON.stringify(currentDraft));
        });
    }

    // 3. WIPE CLEAN ON COMPLETED SUBMISSION: Clear everything when the form is submitted successfully
    if (mainForm) {
        mainForm.addEventListener('submit', () => {
            localStorage.removeItem('pwdFormDraftData');
            localStorage.removeItem('isDraftSaved');
            localStorage.removeItem('activeStepNum');
        });
    }

    /* ==========================================================================
       ── MOBILE REGISTRATION SIDEBAR FAB CONTROLLER ENGINE ──
       ========================================================================== */
    const fabToggle = document.getElementById('fab-toggle');
    const fabClose = document.getElementById('fab-close');
    const fabCard = document.getElementById('fab-target-card');

    if (fabToggle && fabCard) {
        fabToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            // Toggle the custom layout visibility state class rule wrapper
            fabCard.classList.toggle('is-open');
        });
    }

    if (fabClose && fabCard) {
        fabClose.addEventListener('click', () => {
            fabCard.classList.remove('is-open');
        });
    }

    document.addEventListener('click', (e) => {
        if (fabCard && fabToggle && !fabCard.contains(e.target) && !fabToggle.contains(e.target)) {
            fabCard.classList.remove('is-open');
        }
    });

    /* ==========================================================================
       ── ENHANCED FILE ATTACHMENT VALIDATION ENGINE ──
       ========================================================================== */
    const uploadRules = {
        'file-id-pic': { 
            maxSize: 2 * 1024 * 1024, 
            allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'], 
            previewId: 'preview-id-pic', 
            rowId: 'row-id-pic' 
        },
        'file-med-cert': { 
            maxSize: 5 * 1024 * 1024, 
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'], 
            previewId: 'preview-med-cert', 
            rowId: 'row-med-cert' 
        },
        'file-brgy-cert': { 
            maxSize: 5 * 1024 * 1024, 
            allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'], 
            previewId: 'preview-brgy-cert', 
            rowId: 'row-brgy-cert' 
        }
    };

    Object.keys(uploadRules).forEach(inputId => {
        const fileInput = document.getElementById(inputId);
        if (!fileInput) return;

        fileInput.addEventListener('change', function() {
            const rule = uploadRules[inputId];
            const previewEl = document.getElementById(rule.previewId);
            const rowEl = document.getElementById(rule.rowId);
            
            if (this.files.length === 0) {
                if (previewEl) previewEl.textContent = "No file chosen";
                if (rowEl) rowEl.classList.remove('file-row-success');
                return;
            }

            const file = this.files[0];
            
            // 1. Validate File Size
            if (file.size > rule.maxSize) {
                const maxMb = rule.maxSize / (1024 * 1024);
                alert(`Error: "${file.name}" exceeds the maximum limit size of ${maxMb}MB.`);
                this.value = ""; // Clear out input data log stream safely
                if (previewEl) previewEl.textContent = "No file chosen";
                if (rowEl) rowEl.classList.remove('file-row-success');
                return;
            }

            // 2. Validate File Type Extension
            if (!rule.allowedTypes.includes(file.type) && file.type !== "") {
                alert(`Error: Invalid file format type. Please upload approved documents only.`);
                this.value = ""; 
                if (previewEl) previewEl.textContent = "No file chosen";
                if (rowEl) rowEl.classList.remove('file-row-success');
                return;
            }

            // 3. Update preview states on clean validation matches
            if (previewEl) {
                previewEl.textContent = file.name;
            }
            if (rowEl) {
                rowEl.classList.add('file-row-success');
            }
        });
    });

    /* ==========================================================================
       ── VISUAL PREVIEW MODAL INTERACTIVE LOGIC ──
       ========================================================================== */
    const linkPreviewId = document.getElementById('link-preview-id'); // Hero ID Link
    const modalVisualPreview = document.getElementById('modal-visual-preview');
    const previewTitle = document.getElementById('preview-modal-title');
    const previewDesc = document.getElementById('preview-modal-description');
    const closePreviewModal = document.getElementById('close-preview-modal');

    // Structural Display Layout Selectors
    const singlePreviewBox = document.getElementById('single-preview-box');
    const multiPreviewBox = document.getElementById('multi-preview-box');

    // Individual Asset Image Selectors
    const previewImgSingle = document.getElementById('preview-modal-img');
    const previewImgBrgy = document.getElementById('preview-img-brgy');
    const previewImgIdFront = document.getElementById('preview-img-idfront');
    const previewImgIdBack = document.getElementById('preview-img-idback');

    // Requirement Grid Item Click Action Selectors
    const reqTriggerPhoto = document.getElementById('req-trigger-photo');
    const reqTriggerMedical = document.getElementById('req-trigger-medical');
    const reqTriggerBarangay = document.getElementById('req-trigger-barangay');

    // Modular helper function to launch the preview frame smoothly
    function displayVisualSample(title, description, toggleBoxType, assignImagesCallback) {
        if (!modalVisualPreview || !previewTitle || !previewDesc || !singlePreviewBox || !multiPreviewBox) return;
        
        previewTitle.textContent = title;
        previewDesc.innerHTML = description;
        
        if (toggleBoxType === 'single') {
            multiPreviewBox.style.display = "none";
            singlePreviewBox.style.display = "flex";
        } else if (toggleBoxType === 'multi') {
            singlePreviewBox.style.display = "none";
            multiPreviewBox.style.display = "flex";
        }
        
        assignImagesCallback();
        modalVisualPreview.style.display = 'flex';
    }

    // 1. New Trigger: Physical PWD ID Card Sample (From Hero Section)
    if (linkPreviewId) {
        linkPreviewId.addEventListener('click', (e) => {
            e.preventDefault();
            displayVisualSample(
                "Physical PWD ID Card Sample",
                "• Official card format issued by the Cagayan de Oro City Government.<br>• Features your unique control number, photo, and disability classification.",
                "single",
                () => { previewImgSingle.src = "sampleID.png"; }
            );
        });
    }

    // 2. Requirement Item Row 1: 1x1 Photo
    if (reqTriggerPhoto) {
        reqTriggerPhoto.addEventListener('click', () => {
            displayVisualSample(
                "1×1 Photo Specifications",
                "• Recent photo with a plain white background.<br>• Face must look straight forward with clear, clear lighting.<br>• Avoid dark sunglasses, hats, or heavy filters.",
                "single",
                () => { previewImgSingle.src = "1x1sample.jpg"; }
            );
        });
    }

    // 3. Requirement Item Row 2: Medical Certificate
    if (reqTriggerMedical) {
        reqTriggerMedical.addEventListener('click', () => {
            displayVisualSample(
                "Medical Certificate Reference Layout",
                "• Must be signed by a licensed physician or clinic specialist.<br>• Explicitly confirms your specific disability classification group.<br>• Text logs, doctor signature, and license numbers must be fully legible.",
                "single",
                () => { previewImgSingle.src = "medcertsample.png"; }
            );
        });
    }

    // 4. Requirement Item Row 3: Residency Proof (Multi-Asset View)
    if (reqTriggerBarangay) {
        reqTriggerBarangay.addEventListener('click', () => {
            displayVisualSample(
                "Identity & Residency Verification Options",
                "• <strong>Option A:</strong> Standard Barangay Clearance certificate issued within the last 6 months.<br>• <strong>Option B:</strong> Front and Back copy of your official Government National ID proving your local residency.",
                "multi",
                () => {
                    previewImgBrgy.src = "brgycertsample.jpg";
                    previewImgIdFront.src = "NatID_front.png";
                    previewImgIdBack.src = "NatID_back.png";
                }
            );
        });
    }

    // Reusable Close Operations Click Interfaces
    if (closePreviewModal) {
        closePreviewModal.addEventListener('click', () => {
            if (modalVisualPreview) modalVisualPreview.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalVisualPreview) {
            modalVisualPreview.style.display = 'none';
        }
    });

    /* ==========================================================================
       ── CLICK-TO-FULLSCREEN ENHANCEMENT ENGINE ──
       ========================================================================== */
    const previewClickZones = document.querySelectorAll('.single-preview-frame, .sub-option-box');
    const allPreviewImages = document.querySelectorAll('#modal-visual-preview img');

    // 1. OPEN TRIGGER: Uses target tracking to grab the EXACT image asset being clicked
    previewClickZones.forEach(zone => {
        zone.addEventListener('click', (e) => {
            // Target the exact image element that your mouse pointer or thumb clicked on
            const targetImg = e.target.closest('img');
            
            // Safety Check: If the user clicked the blank space in the card frame instead of the image, grab the first image available
            const finalImg = targetImg || zone.querySelector('img');
            
            // Only toggle open if an image exists and it isn't already expanded full screen
            if (finalImg && !finalImg.classList.contains('image-fullscreen-active')) {
                e.stopPropagation(); 
                finalImg.classList.add('image-fullscreen-active');
            }
        });
    });

    // 2. CLOSE TRIGGER: Clicking directly on the active fullscreen image layer forces it closed safely
    allPreviewImages.forEach(img => {
        img.addEventListener('click', (e) => {
            if (img.classList.contains('image-fullscreen-active')) {
                e.stopPropagation(); // CRITICAL: Traps click event inside image box layer so it doesn't touch cards behind it
                img.classList.remove('image-fullscreen-active');
            }
        });
    });

    // 3. BACKUP HARD CANCEL ROUTINES (Escape Key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            allPreviewImages.forEach(img => {
                img.classList.remove('image-fullscreen-active');
            });
        }
    });

    /* ==========================================================================
       ── ACCESSIBILITY & ESCAPE KEY MODAL DISMISS ENGINE ──
       ========================================================================== */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const allModals = document.querySelectorAll('.modal');
            allModals.forEach(modal => {
                modal.style.display = 'none';
            });
            if (typeof clearErrors === 'function') {
                clearErrors();
            }
        }
    });
    
});