/**
 * Main JavaScript - form validation, animations, notifications
 */

/* INITIALIZATION */
$(document).ready(function () {
  // Add scroll animations
  AOS.init({
    duration: 700,
    easing: "ease-out-cubic",
    once: true,
    offset: 60,
  });

  // Setup tooltips
  $('[data-toggle="tooltip"]').tooltip();

  // Highlight active navigation
  highlightActiveNav();

  // Add shadow effect to navbar on scroll
  initStickyNavbar();
});

/* NAVBAR */
// Add shadow to navbar when scrolled
function initStickyNavbar() {
  $(window).scroll(function () {
    if ($(this).scrollTop() > 20) {
      $(".navbar-ems")
        .addClass("scrolled")
        .css("box-shadow", "0 4px 20px rgba(0,0,0,0.1)");
    } else {
      $(".navbar-ems")
        .removeClass("scrolled")
        .css("box-shadow", "0 1px 3px rgba(0,0,0,0.08)");
    }
  });
}

// Mark active navigation link
function highlightActiveNav() {
  var currentPath = window.location.pathname.split("/").pop();
  $(".navbar-ems .nav-link").each(function () {
    var href = $(this).attr("href");
    if (href && href.includes(currentPath) && currentPath !== "") {
      $(this).addClass("active");
    }
  });
}

/* TOAST NOTIFICATIONS */
// Show notification message
function showToast(message, type = "success", duration = 4000) {
  var iconMap = {
    success: "fa-check-circle",
    danger: "fa-times-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  };
  var colorMap = {
    success: "#10B981",
    danger: "#EF4444",
    warning: "#F59E0B",
    info: "#2563EB",
  };

  // Create container if not exists
  if ($(".toast-container-ems").length === 0) {
    $("body").append('<div class="toast-container-ems"></div>');
  }

  var toastId = "toast_" + Date.now();
  var toastHtml = `
    <div class="toast-ems ${type}" id="${toastId}">
      <i class="fas ${iconMap[type]}" style="color:${colorMap[type]};font-size:1.1rem;flex-shrink:0;"></i>
      <span style="font-size:0.92rem;font-weight:500;flex:1;">${message}</span>
      <button onclick="$('#${toastId}').fadeOut(300,function(){$(this).remove();})"
        style="background:none;border:none;cursor:pointer;color:#9CA3AF;padding:0 0 0 8px;">
        <i class="fas fa-times"></i>
      </button>
    </div>`;

  $(".toast-container-ems").append(toastHtml);

  // Auto-remove after duration
  setTimeout(function () {
    $("#" + toastId).fadeOut(400, function () {
      $(this).remove();
    });
  }, duration);
}

/* FORM VALIDATION HELPERS */
// Check if email is valid
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Check password strength (min 8 chars, 1 uppercase, 1 number)
function isStrongPassword(password) {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

// Check phone number format
function isValidPhone(phone) {
  return /^[+]?[\d\s\-]{8,15}$/.test(phone);
}

// Show error message on form field
function showFieldError($field, message) {
  $field.addClass("is-invalid").removeClass("is-valid");
  var $feedback = $field.siblings(".invalid-feedback");
  if ($feedback.length === 0) {
    $field.after('<div class="invalid-feedback">' + message + "</div>");
  } else {
    $feedback.text(message).show();
  }
}

// Mark form field as valid
function showFieldSuccess($field) {
  $field.addClass("is-valid").removeClass("is-invalid");
  $field.siblings(".invalid-feedback").hide();
}

// Clear all validation messages
function clearValidation($form) {
  $form.find(".form-control").removeClass("is-invalid is-valid");
  $form.find(".invalid-feedback").hide();
}

/* ============================================================
   LOGIN FORM VALIDATION
   ============================================================ */
$("#loginForm").on("submit", function (e) {
  var isValid = true;
  clearValidation($(this));

  var $email = $("#loginEmail");
  var $password = $("#loginPassword");

  // Email validation
  if (!$email.val().trim()) {
    showFieldError($email, "Email address is required.");
    isValid = false;
  } else if (!isValidEmail($email.val().trim())) {
    showFieldError($email, "Please enter a valid email address.");
    isValid = false;
  } else {
    showFieldSuccess($email);
  }

  // Password validation
  if (!$password.val()) {
    showFieldError($password, "Password is required.");
    isValid = false;
  } else {
    showFieldSuccess($password);
  }

  if (!isValid) {
    e.preventDefault();
    showToast("Please fix the errors below before submitting.", "danger");
  }
});

/* ============================================================
   SIGNUP FORM VALIDATION
   ============================================================ */
$("#signupForm").on("submit", function (e) {
  var isValid = true;
  clearValidation($(this));

  var fields = {
    name: { id: "#signupName", label: "Full name" },
    email: { id: "#signupEmail", label: "Email" },
    password: { id: "#signupPassword", label: "Password" },
    confirm: { id: "#signupConfirm", label: "Confirm password" },
    phone: { id: "#signupPhone", label: "Phone number" },
  };

  // Name
  var $name = $(fields.name.id);
  if (!$name.val().trim() || $name.val().trim().length < 3) {
    showFieldError($name, "Full name must be at least 3 characters.");
    isValid = false;
  } else {
    showFieldSuccess($name);
  }

  // Email
  var $email = $(fields.email.id);
  if (!$email.val().trim() || !isValidEmail($email.val().trim())) {
    showFieldError($email, "Please enter a valid email address.");
    isValid = false;
  } else {
    showFieldSuccess($email);
  }

  // Password
  var $password = $(fields.password.id);
  if (!$password.val() || !isStrongPassword($password.val())) {
    showFieldError(
      $password,
      "Password must be at least 8 characters with 1 uppercase and 1 number.",
    );
    isValid = false;
  } else {
    showFieldSuccess($password);
  }

  // Confirm password
  var $confirm = $(fields.confirm.id);
  if ($confirm.val() !== $password.val()) {
    showFieldError($confirm, "Passwords do not match.");
    isValid = false;
  } else if ($confirm.val()) {
    showFieldSuccess($confirm);
  }

  // Phone (if present)
  var $phone = $(fields.phone.id);
  if ($phone.length && !isValidPhone($phone.val().trim())) {
    showFieldError($phone, "Please enter a valid phone number.");
    isValid = false;
  } else if ($phone.length) {
    showFieldSuccess($phone);
  }

  // Provider document upload validation
  var $doc = $("#providerDocument");
  if ($doc.length && $doc.val()) {
    var fileName = $doc.val().toLowerCase();
    if (
      !fileName.endsWith(".pdf") &&
      !fileName.endsWith(".doc") &&
      !fileName.endsWith(".docx")
    ) {
      showFieldError($doc, "Only PDF or DOC/DOCX files are allowed.");
      isValid = false;
    }
  }

  if (!isValid) {
    e.preventDefault();
    showToast("Please fix the errors below.", "danger");
  }
});

/* ============================================================
   ENROLLMENT FORM VALIDATION
   ============================================================ */
$("#enrollmentForm").on("submit", function (e) {
  var isValid = true;
  clearValidation($(this));

  // IC Number
  var $ic = $("#icNumber");
  if (
    $ic.length &&
    !$ic
      .val()
      .trim()
      .match(/^\d{12}$/)
  ) {
    showFieldError($ic, "Please enter a valid 12-digit IC number.");
    isValid = false;
  } else if ($ic.length) {
    showFieldSuccess($ic);
  }

  // Phone
  var $phone = $("#enrollPhone");
  if ($phone.length && !isValidPhone($phone.val().trim())) {
    showFieldError($phone, "Please enter a valid phone number.");
    isValid = false;
  } else if ($phone.length) {
    showFieldSuccess($phone);
  }

  if (!isValid) {
    e.preventDefault();
    showToast("Please complete all required fields.", "warning");
  }
});

/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
$("#contactForm").on("submit", function (e) {
  e.preventDefault();
  var isValid = true;
  clearValidation($(this));

  var $name = $("#contactName");
  var $email = $("#contactEmail");
  var $message = $("#contactMessage");

  if (!$name.val().trim()) {
    showFieldError($name, "Name is required.");
    isValid = false;
  } else {
    showFieldSuccess($name);
  }

  if (!isValidEmail($email.val().trim())) {
    showFieldError($email, "Please enter a valid email.");
    isValid = false;
  } else {
    showFieldSuccess($email);
  }

  if ($message.val().trim().length < 20) {
    showFieldError($message, "Message must be at least 20 characters.");
    isValid = false;
  } else {
    showFieldSuccess($message);
  }

  if (isValid) {
    // Simulate form submission for front-end
    $(this)
      .find('[type="submit"]')
      .prop("disabled", true)
      .html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...');
    setTimeout(function () {
      showToast("Your message has been sent successfully!", "success");
      $("#contactForm")[0].reset();
      clearValidation($("#contactForm"));
      $('#contactForm [type="submit"]')
        .prop("disabled", false)
        .html('<i class="fas fa-paper-plane me-2"></i>Send Message');
    }, 1500);
  }
});

/* ============================================================
   REVIEW FORM VALIDATION
   ============================================================ */
$("#reviewForm").on("submit", function (e) {
  var isValid = true;
  var ratingVal = $('input[name="rating"]:checked').val();
  var $feedback = $("#reviewFeedback");

  if (!ratingVal) {
    showToast("Please select a star rating.", "warning");
    isValid = false;
  }

  if ($feedback.length && $feedback.val().trim().length < 10) {
    showFieldError($feedback, "Feedback must be at least 10 characters.");
    isValid = false;
  } else if ($feedback.length) {
    showFieldSuccess($feedback);
  }

  if (!isValid) e.preventDefault();
});

/* ============================================================
   COURSE FORM VALIDATION (PROVIDER)
   ============================================================ */
$("#courseForm").on("submit", function (e) {
  var isValid = true;
  clearValidation($(this));

  var $title = $("#courseTitle");
  var $desc = $("#courseDesc");
  var $fee = $("#courseFee");
  var $start = $("#courseStart");
  var $end = $("#courseEnd");

  if (!$title.val().trim() || $title.val().trim().length < 5) {
    showFieldError($title, "Course title must be at least 5 characters.");
    isValid = false;
  } else {
    showFieldSuccess($title);
  }

  if (!$desc.val().trim() || $desc.val().trim().length < 30) {
    showFieldError($desc, "Description must be at least 30 characters.");
    isValid = false;
  } else {
    showFieldSuccess($desc);
  }

  if ($fee.length) {
    var feeVal = parseFloat($fee.val());
    if (isNaN(feeVal) || feeVal < 0) {
      showFieldError($fee, "Please enter a valid fee (0 or above).");
      isValid = false;
    } else {
      showFieldSuccess($fee);
    }
  }

  if ($start.length && $end.length && $start.val() && $end.val()) {
    if (new Date($end.val()) <= new Date($start.val())) {
      showFieldError($end, "End date must be after start date.");
      isValid = false;
    } else {
      showFieldSuccess($end);
    }
  }

  if (!isValid) {
    e.preventDefault();
    showToast("Please fix the highlighted errors.", "danger");
  }
});

/* ============================================================
   PASSWORD STRENGTH METER
   ============================================================ */
$("#signupPassword").on("input", function () {
  var val = $(this).val();
  var strength = 0;
  var $meter = $("#passwordStrength");

  if ($meter.length === 0) return;

  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/\d/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;

  var labels = ["", "Weak", "Fair", "Good", "Strong"];
  var colors = ["", "#EF4444", "#F59E0B", "#3B82F6", "#10B981"];
  var widths = ["0%", "25%", "50%", "75%", "100%"];

  $meter
    .find(".strength-bar")
    .css({ width: widths[strength], background: colors[strength] });
  $meter
    .find(".strength-label")
    .text(strength ? labels[strength] : "")
    .css("color", colors[strength]);
});

/* ============================================================
   PRINT RECEIPT
   ============================================================ */
function printReceipt() {
  window.print();
}

/* ============================================================
   CONFIRM DELETE
   ============================================================ */
/**
 * Shows a Bootstrap confirmation modal before deleting a record.
 * @param {string} courseId  - ID of the course to delete.
 * @param {string} courseName - Name of the course.
 */
function confirmDelete(courseId, courseName) {
  $("#deleteCourseName").text(courseName);
  $("#deleteForm").attr("action", "php/delete_course.php");
  $("#deleteCourseId").val(courseId);
  $("#deleteModal").modal("show");
}

/* ============================================================
   ANIMATED COUNTER (Stats Section)
   ============================================================ */
function animateCounters() {
  $(".stat-number[data-target]").each(function () {
    var $this = $(this);
    var target = parseInt($this.data("target"));
    var current = 0;
    var increment = Math.ceil(target / 60);

    var timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      $this.text(current.toLocaleString());
    }, 25);
  });
}

// Trigger counters when stats section is visible
var statsAnimated = false;
$(window).scroll(function () {
  var $statsSection = $(".stats-section");
  if ($statsSection.length && !statsAnimated) {
    var top = $statsSection.offset().top;
    var scrollTop = $(this).scrollTop() + $(this).height();
    if (scrollTop > top) {
      animateCounters();
      statsAnimated = true;
    }
  }
});

/* ============================================================
   FILE UPLOAD PREVIEW
   ============================================================ */
$("#providerDocument, #uploadDocument").on("change", function () {
  var file = this.files[0];
  var $preview = $("#filePreview");
  if (!$preview.length) return;

  if (file) {
    var allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      $preview.html(
        '<span style="color:var(--danger);font-size:0.85rem;"><i class="fas fa-exclamation-circle me-1"></i>Invalid file type. PDF or DOC only.</span>',
      );
      $(this).val("");
      return;
    }
    var sizeMB = (file.size / 1024 / 1024).toFixed(2);
    $preview.html(`<i class="fas fa-file-alt me-1" style="color:var(--primary);"></i>
      <span style="font-size:0.85rem;color:var(--text-muted);">${file.name} (${sizeMB} MB)</span>`);
  } else {
    $preview.html("");
  }
});

/* ============================================================
   PAYMENT PAGE MOCK
   ============================================================ */
$("#paymentForm").on("submit", function (e) {
  var isValid = true;
  clearValidation($(this));

  var $card = $("#cardNumber");
  var $expiry = $("#cardExpiry");
  var $cvv = $("#cardCvv");
  var $name = $("#cardName");

  if ($name.length && !$name.val().trim()) {
    showFieldError($name, "Cardholder name is required.");
    isValid = false;
  } else if ($name.length) {
    showFieldSuccess($name);
  }

  if (
    $card.length &&
    !$card
      .val()
      .replace(/\s/g, "")
      .match(/^\d{16}$/)
  ) {
    showFieldError($card, "Please enter a valid 16-digit card number.");
    isValid = false;
  } else if ($card.length) {
    showFieldSuccess($card);
  }

  if ($expiry.length && !$expiry.val().match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
    showFieldError($expiry, "Enter expiry as MM/YY.");
    isValid = false;
  } else if ($expiry.length) {
    showFieldSuccess($expiry);
  }

  if ($cvv.length && !$cvv.val().match(/^\d{3,4}$/)) {
    showFieldError($cvv, "Enter a valid 3 or 4 digit CVV.");
    isValid = false;
  } else if ($cvv.length) {
    showFieldSuccess($cvv);
  }

  if (!isValid) {
    e.preventDefault();
    showToast("Please fix payment details.", "danger");
  } else {
    $(this)
      .find('[type="submit"]')
      .prop("disabled", true)
      .html('<i class="fas fa-spinner fa-spin me-2"></i>Processing...');
  }
});

// Card number auto-formatting
$("#cardNumber").on("input", function () {
  var val = $(this).val().replace(/\D/g, "").substring(0, 16);
  $(this).val(val.replace(/(\d{4})/g, "$1 ").trim());
});

// Card expiry auto-formatting
$("#cardExpiry").on("input", function () {
  var val = $(this).val().replace(/\D/g, "").substring(0, 4);
  if (val.length > 2) val = val.substring(0, 2) + "/" + val.substring(2);
  $(this).val(val);
});

/* ============================================================
   SEARCH / FILTER COURSES (front-end filtering)
   ============================================================ */
$("#courseSearch").on("input", function () {
  var query = $(this).val().toLowerCase();
  filterCourses(query, $("#categoryFilter").val());
});

$("#categoryFilter").on("change", function () {
  var category = $(this).val().toLowerCase();
  filterCourses($("#courseSearch").val().toLowerCase(), category);
});

/**
 * Filters course cards based on search text and category.
 * @param {string} query    - Search text.
 * @param {string} category - Category filter value.
 */
function filterCourses(query, category) {
  var visible = 0;
  $(".course-card-item").each(function () {
    var title = $(this).data("title") || "";
    var cat = $(this).data("category") || "";
    var titleMatch = title.toLowerCase().includes(query);
    var catMatch = !category || cat.toLowerCase() === category.toLowerCase();

    if (titleMatch && catMatch) {
      $(this).fadeIn(200);
      visible++;
    } else {
      $(this).fadeOut(200);
    }
  });

  // Show "no results" message
  var $noResults = $("#noCoursesMsg");
  if (visible === 0) {
    $noResults.fadeIn(200);
  } else {
    $noResults.fadeOut(200);
  }
}

/* ============================================================
   SIDEBAR MOBILE TOGGLE
   ============================================================ */
$("#sidebarToggle").on("click", function () {
  $(".dashboard-sidebar").toggleClass("sidebar-open");
  $(this).find("i").toggleClass("fa-bars fa-times");
});

/* ============================================================
   BACK TO TOP
   ============================================================ */
$(window).scroll(function () {
  if ($(this).scrollTop() > 400) {
    $("#backToTop").fadeIn(300);
  } else {
    $("#backToTop").fadeOut(300);
  }
});

$("#backToTop").on("click", function () {
  $("html, body").animate({ scrollTop: 0 }, 500);
});
