function showMessage() {
  alert("🤫 Un secret bien gardé… Vous aimez bien manger ? Vous êtes au bon endroit ...🤤");
}

let panier = [];

function ajouterAuPanier(nom, prix) {
  panier.push({ nom, prix });
  afficherPanier();
  
  // Afficher une notification
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = `${nom} ajouté au panier!`;
  document.body.appendChild(notification);
  
  // Animation et suppression de la notification
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 2000);
}

function afficherPanier() {
  const liste = document.getElementById("liste-panier");
  const total = document.getElementById("total-panier");
  liste.innerHTML = "";

  let totalPrix = 0;
  panier.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.nom} - ${item.prix} F CFA `;
    
    // Ajouter un bouton de suppression
    const btnSupprimer = document.createElement("button");
    btnSupprimer.textContent = "✕";
    btnSupprimer.className = "btn-supprimer";
    btnSupprimer.onclick = function() {
      supprimerDuPanier(index);
    };
    li.appendChild(btnSupprimer);
    
    liste.appendChild(li);
    totalPrix += item.prix;
  });

  total.textContent = totalPrix.toFixed(0) + " F CFA";
  
  // Ajouter un bouton pour vider le panier si non vide
  if (panier.length > 0 && !document.getElementById("vider-panier")) {
    const btnVider = document.createElement("button");
    btnVider.id = "vider-panier";
    btnVider.textContent = "Vider le panier";
    btnVider.onclick = viderPanier;
    btnVider.className = "btn-vider";
    document.getElementById("panier").appendChild(btnVider);
  } else if (panier.length === 0 && document.getElementById("vider-panier")) {
    document.getElementById("vider-panier").remove();
  }
}

function supprimerDuPanier(index) {
  panier.splice(index, 1);
  afficherPanier();
}

function viderPanier() {
  panier = [];
  afficherPanier();
}

// Mise à jour automatique du total
function calculerTotalProduit() {
  const produitSelect = document.getElementById("produit");
  const quantite = parseInt(document.getElementById("quantite-produit").value);
  if (produitSelect.selectedIndex > 0) {
    const prix = parseInt(produitSelect.options[produitSelect.selectedIndex].dataset.prix || 0);
    return prix * quantite;
  }
  return 0;
}

function calculerTotalMenu() {
  const menuSelect = document.getElementById("menu");
  const quantite = parseInt(document.getElementById("quantite-menu").value);
  if (menuSelect.selectedIndex > 0) {
    const prix = parseInt(menuSelect.options[menuSelect.selectedIndex].getAttribute("data-prix") || 0);
    return prix * quantite;
  }
  return 0;
}

// Génération du PDF
document.addEventListener("DOMContentLoaded", function() {
  // S'assurer que le bouton existe
  const telechargerBtn = document.getElementById("telecharger-btn");
  if (telechargerBtn) {
    telechargerBtn.addEventListener("click", genererPDF);
  }
  
  // Ajouter des écouteurs d'événements pour les calculs
  const produitSelect = document.getElementById("produit");
  const quantiteProduit = document.getElementById("quantite-produit");
  const menuSelect = document.getElementById("menu");
  const quantiteMenu = document.getElementById("quantite-menu");
  // Dans la fonction genererPDF()

  if (produitSelect && quantiteProduit) {
    produitSelect.addEventListener("change", mettreAJourRecap);
    quantiteProduit.addEventListener("input", mettreAJourRecap);
  }
  
  let menuPrix = 0;
if (menuSelect.selectedIndex > 0) {
  menuTexte = menuSelect.options[menuSelect.selectedIndex].text;
  menuPrix = parseInt(menuSelect.options[menuSelect.selectedIndex].getAttribute("data-prix") || 0);
}
});

function mettreAJourRecap() {
  const totalProduit = calculerTotalProduit();
  const totalMenu = calculerTotalMenu();
  const totalGeneral = totalProduit + totalMenu;
  
  const recapContainer = document.getElementById("recap-commande");
  if (!recapContainer) {
    const container = document.createElement("div");
    container.id = "recap-commande";
    container.className = "recap-commande";
    
    const h3 = document.createElement("h3");
    h3.textContent = "Récapitulatif de votre commande";
    container.appendChild(h3);
    
    const p = document.createElement("p");
    p.id = "recap-total";
    p.textContent = `Total: ${totalGeneral} F CFA`;
    container.appendChild(p);
    
    const form = document.getElementById("formulaire-commande");
    form.parentNode.insertBefore(container, form.nextSibling);
  } else {
    document.getElementById("recap-total").textContent = `Total: ${totalGeneral} F CFA`;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function genererPDF() {
  // Vérifier que jsPDF est correctement chargé
  if (!window.jspdf) {
    console.error("La bibliothèque jsPDF n'est pas chargée");
    alert("Une erreur est survenue lors du chargement de jsPDF. Veuillez rafraîchir la page.");
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    
    // Récupérer les données du formulaire
    const nom = document.querySelector("[name='nom & prenom']").value;
    const email = document.querySelector("[name='email']").value;
    const phone = document.querySelector("[name='phone']").value;
    const adresse = document.querySelector("[name='adresse']").value;
    const date = document.querySelector("[name='date']").value;
    const time = document.querySelector("[name='time']").value;
    
    // Récupérer les sélections des menus déroulants
    const produitSelect = document.querySelector("[name='produit']");
    const menuSelect = document.querySelector("[name='menu']");
    
    let produitTexte = "Aucun produit sélectionné";
    let produitPrix = 0;
    if (produitSelect.selectedIndex > 0) {
      produitTexte = produitSelect.options[produitSelect.selectedIndex].text;
      produitPrix = parseInt(produitSelect.options[produitSelect.selectedIndex].dataset.prix || 0);
    }
    
    let menuTexte = "Aucun menu sélectionné";
    let menuPrix = 0;
    if (menuSelect.selectedIndex > 0) {
      menuTexte = menuSelect.options[menuSelect.selectedIndex].text;
      menuPrix = parseInt(menuSelect.options[menuSelect.selectedIndex].dataset.prix || 0);
    }
    
    const quantiteProduit = parseInt(document.querySelector("[name='quantite_produit']").value || 0);
    const quantiteMenu = parseInt(document.querySelector("[name='quantite_menu']").value || 0);
    const message = document.querySelector("[name='message']").value || "Aucun message";
    
    // Calculer le total
    const totalProduit = produitPrix * quantiteProduit;
    const totalMenu = menuPrix * quantiteMenu;
    const totalGeneral = totalProduit + totalMenu;
    
    // Créer le PDF
    const doc = new jsPDF();
    
    // Ajouter un style au PDF
    doc.setDrawColor(94, 128, 71); // Couleur verte du header
    doc.setFillColor(94, 128, 71);
    doc.rect(0, 0, 210, 30, 'F');
    
    // Titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text("Jean Nicolas Food", 105, 15, { align: "center" });
    
    // Sous-titre
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Confirmation de Commande", 105, 40, { align: "center" });
    
    // Date et référence
    const today = new Date();
    const reference = "JNF-" + today.getFullYear() + (today.getMonth() + 1).toString().padStart(2, "0") + today.getDate().toString().padStart(2, "0") + "-" + Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    
    doc.setFontSize(10);
    doc.text(`Date: ${today.toLocaleDateString('fr-FR')}`, 20, 50);
    doc.text(`Référence: ${reference}`, 150, 50);
    
    // Informations client
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 60, 170, 50, 'F');
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS CLIENT", 105, 70, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Nom & Prénom: ${nom}`, 30, 80);
    doc.text(`Email: ${email}`, 30, 87);
    doc.text(`Téléphone: ${phone}`, 30, 94);
    doc.text(`Adresse: ${adresse}`, 30, 101);
    
    // Informations de livraison
    doc.setFillColor(240, 240, 240);
    doc.rect(20, 120, 170, 30, 'F');
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS DE LIVRAISON", 105, 130, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Date de livraison: ${formatDate(date)}`, 30, 140);
    doc.text(`Heure de livraison: ${time}`, 120, 140);
    
    // Détails de la commande
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DÉTAILS DE LA COMMANDE", 105, 160, { align: "center" });
    
    // En-têtes du tableau
    doc.setFillColor(230, 230, 230);
    doc.rect(20, 165, 170, 10, 'F');
    
    doc.setFontSize(10);
    doc.text("Article", 25, 172);
    doc.text("Prix unitaire", 90, 172);
    doc.text("Quantité", 130, 172);
    doc.text("Total", 170, 172);
    
    // Lignes du tableau
    let y = 182;
    
    // Ligne pour le produit
    if (produitSelect.selectedIndex > 0) {
      doc.setFont("helvetica", "normal");
      doc.text(produitTexte, 25, y);
      doc.text(`${produitPrix} F CFA`, 90, y);
      doc.text(`${quantiteProduit}`, 130, y);
      doc.text(`${totalProduit} F CFA`, 170, y);
      y += 10;
    }
    
    // Ligne pour le menu
    if (menuSelect.selectedIndex > 0) {
      doc.setFont("helvetica", "normal");
      doc.text(menuTexte, 25, y);
      doc.text(`${menuPrix} F CFA`, 90, y);
      doc.text(`${quantiteMenu}`, 130, y);
      doc.text(`${totalMenu} F CFA`, 170, y);
      y += 10;
    }
    
    // Ligne pour le total
    doc.setDrawColor(200, 200, 200);
    doc.line(20, y, 190, y);
    y += 7;
    
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", 130, y);
    doc.text(`${totalGeneral} F CFA`, 170, y);
    
    // Message
    if (message && message !== "Aucun message") {
      y += 20;
      doc.setFont("helvetica", "bold");
      doc.text("MESSAGE:", 20, y);
      y += 7;
      
      doc.setFont("helvetica", "normal");
      const splitMessage = doc.splitTextToSize(message, 170);
      doc.text(splitMessage, 20, y);
    }
    
    // Pied de page
    y = 270;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Merci d'avoir choisi Jean Nicolas Food!", 105, y, { align: "center" });
    doc.text("N'hésitez pas à nous contacter sur WhatsApp pour toute question.", 105, y + 5, { align: "center" });
    
    // Sauvegarder le PDF
    doc.save("commande-jean-nicolas-food.pdf");
    
    // Afficher une confirmation
    const confirmation = document.getElementById("confirmation");
    if (confirmation) {
      confirmation.textContent = "✅ Votre commande a été téléchargée avec succès!";
      confirmation.style.color = "green";
      confirmation.style.fontWeight = "bold";
      confirmation.style.padding = "10px";
      confirmation.style.backgroundColor = "#eafaea";
      confirmation.style.borderRadius = "5px";
      confirmation.style.marginTop = "15px";
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        confirmation.textContent = "";
        confirmation.style.backgroundColor = "transparent";
        confirmation.style.padding = "0";
      }, 5000);
    }
    
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
    alert("Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.");
  }
}