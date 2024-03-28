var languageUid = 0;
var l10n = {
    fr: {
        // Pagination / carrousel
        paginationMoreElement: "Afficher plus de résultats",
        goToNextSection:       "Aller à la section suivante",
        loading:               "Chargement...",
        prevStep:              "Étape précédente",
        nextStep:              "Étape suivante",
        prevPage:              "Page précédente",
        nextPage:              "Page suivante",
        prev:                  "Précédent",
        next:                  "Suivant",
        stopCarrousel:         "Arrêter le diaporama",
        startCarrousel:        "Lancer le diaporama",
        activeSlide:           "Slide active",

        // Liste Savoir plus, Télécharger...
        listReadMore: "En savoir plus",
        listDownload: "Télécharger",
        listSeeAlso:  "Voir aussi",

        // Vérification des formulaires
        mandatory:                   "obligatoire",
        formErrorInvalidDate:        "La date doit être au format jj/mm/aaaa.",
        formErrorBirthdayInFutur:    "La date de naissance est plus récente que la date d'aujourd'hui.",
        formErrorBirthdayDoNotExist: "La date de naissance n'existe pas.",
        formErrorEnterMail:          "Veuillez entrer votre courriel.",
        formErrorConfirmMail:        "Veuillez confirmer votre courriel.",
        formErrorInvalidMail:        "Votre adresse e-mail est invalide. \nLe format doit être du type adresse@e-mail.com, sans espace ni caractères spéciaux (é, à, ç, !...).",
        formErrorSelectNewsletter:   "Veuillez sélectionner une lettre d'information.",
        formErrorCheckMail:          "La vérification de votre adresse email a échoué.",
        formErrorDateFormat:         "L'un des champs date n'est pas au format jj/mm/aaaa, ou n'est pas valide. \nMerci de corriger.",
        formErrorMandatoryField:     "Ce champ est obligatoire.",
        formErrorsSummary:           "Votre formulaire contient les erreurs suivantes ",
        pleaseWaitForFile:           "Envoi des pièces jointes en cours, veuillez patienter... ",
        pleaseWait:                  "Veuillez patienter... ",

        // Liens
        linkNewWindow:    "Nouvelle fenêtre",
        linkExternalLink: "Lien externe",

        // Popin / galeries
        open:             "Ouvrir",
        close:            "Fermer",
        closeModalWindow: "Fermer la fenêtre modale",
        moreInformation:  "Plus d'information",
        lessInformation:  "Moins d'information",
        nextImage:        "Image suivante",
        prevImage:        "Image précédente",
        pictures:         "images",
        picture:          "image",
        Picture:          "Photo",
        on:               "sur",
        Gallery:          "Galerie",

        // Misc
        navigationError: "Erreur de navigation",
        openMenu:        "Menu principal",
        goToSite:        "Accéder au site ",
        browseThisPage:  "Dans cette page",
        cookieMessage :  "Ce site utilise des cookies pour favoriser votre navigation et enrichir les contenus qui vous sont proposés. <br />Vous pouvez néanmoins les désactiver à tout moment si vous le souhaitez.<br /><br />",

        // results
        noResult: "Aucun résultat",
        displaying: "Affichage de",
        result: "résultat",
        of: "sur",

    },
    en: {
        // Pagination / carrousel
        paginationMoreElement: "Show more results",
        goToNextSection:       "Go to next section",
        loading:               "Loading...",
        prevStep:              "Previous step",
        nextStep:              "Next step",
        prevPage:              "Previous page",
        nextPage:              "Next page",
        prev:                  "Previous",
        next:                  "Next",
        stopCarrousel:         "Stop slider",
        startCarrousel:        "Play slider",
        activeSlide:           "Active slide",

        // Liste Savoir plus, Télécharger...
        listReadMore: "Read more",
        listDownload: "Download",
        listSeeAlso:  "See also",

        // Vérification des formulaires
        mandatory:                   "required",
        formErrorInvalidDate:        "The date must use jj/mm/aaaa format.",
        formErrorBirthdayInFutur:    "The birth date is later than today's date.",
        formErrorBirthdayDoNotExist: "The birth date doesn't exist.",
        formErrorEnterMail:          "Please enter your email address.",
        formErrorConfirmMail:        "Please confirm your email address.",
        formErrorInvalidMail:        "Your email address is not valid. \nIt must use address@email.com format, without spaces or special characters (é, à, ç, !...).",
        formErrorSelectNewsletter:   "Please select a newsletter.",
        formErrorCheckMail:          "The email verification has failed.",
        formErrorDateFormat:         "One of date fields doesn't use jj/mm/aaaa format, or is not valid.",
        formErrorMandatoryField:     "This field is required.",
        formErrorsSummary:           "Your form contains the following errors: ",
        pleaseWaitForFile:           "Sending files in progress, please wait... ",
        pleaseWait:                  "Please wait... ",

        // Liens
        linkNewWindow:    "New window",
        linkExternalLink: "External link",

        // Popin / galeries
        open:             "Open",
        close:            "Close",
        closeModalWindow: "Close modal window",
        moreInformation:  "More information",
        lessInformation:  "Less information",
        nextImage:        "Next picture",
        prevImage:        "Previous picture",
        pictures:         "pictures",
        picture:          "picture",
        Picture:          "Picture",
        on:               "on",

        // Misc
        navigationError: "Browsing error",
        openMenu:        "Main menu",
        goToSite:        "Go to site ",
        browseThisPage:  "Browse this page",
        cookieMessage :  "This website uses cookies to enhance your navigation and enrich the content. <br />Nevertheless you can disable them at any time if you wish.<br /><br />",

        // results
        noResult: "No result",
        displaying: "Displaying",
        result: "result",
        of: "of",
    }
};

l10n = (typeof siteCodeLang !== "undefined") ? l10n[siteCodeLang] : l10n['fr'];
