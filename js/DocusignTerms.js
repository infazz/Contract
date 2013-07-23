function initializePage() {

    // Add values to EDContract pages and elements
    EDContract.Construct();
    EDCNav.Construct('#ExhibitNavigation', 2);
    EDContract.JoinToNav();
}

$(document).ready(function () {
    initializePage();
});