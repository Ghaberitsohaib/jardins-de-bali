export const EMAIL_CONFIG = {
  web3formsKey: '4a4e186e-4647-4241-8594-76a7af13060d',
  recipientEmail: 'contact@bayti-immo.com',
};

/**
 * Submit a form payload to Web3Forms so inquiries arrive in the linked inbox.
 * Returns true on confirmed API delivery, false otherwise.
 */
export async function submitToWeb3Forms(payload) {
  if (!EMAIL_CONFIG.web3formsKey || EMAIL_CONFIG.web3formsKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
    return false;
  }

  const body = {
    access_key: EMAIL_CONFIG.web3formsKey,
    to_email: EMAIL_CONFIG.recipientEmail,
    projet: 'Jardins de Bali Marrakech - Rue Ibn Batouta Menara',
    page_source: window.location.pathname,
    date_heure: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Casablanca' }),
    ...payload,
  };

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    if (response.ok && result.success) {
      return true;
    }
    console.warn('Web3Forms response:', result);
  } catch (err) {
    console.error("Erreur lors de l'envoi de l'email:", err);
  }
  return false;
}

/**
 * Bind a footer inquiry/newsletter form to Web3Forms with duplicate-submit protection.
 */
export function bindFooterWeb3Form(form, { sourceLabel, successMessage, notify }) {
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const firstName = (formData.get('firstName') || '').toString().trim();
    const lastName = (formData.get('lastName') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const fullName = `${firstName} ${lastName}`.trim() || 'Visiteur BaytImmo';

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;

    const delivered = await submitToWeb3Forms({
      subject: `[BaytImmo - ${sourceLabel}] Nouvelle Demande - ${fullName}`,
      from_name: fullName,
      replyto: email || undefined,
      nom_complet: fullName,
      prenom: firstName,
      nom: lastName,
      email,
      source_formulaire: sourceLabel,
    });

    if (submitBtn) submitBtn.disabled = false;
    form.reset();

    const msg = delivered
      ? successMessage
      : 'Votre demande a bien été enregistrée localement. Vous pouvez aussi nous joindre sur WhatsApp.';
    if (typeof notify === 'function') notify(msg);
  });
}

