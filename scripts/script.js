;(function ($) {
    $(function () {
        
        // Calculate promoHeight
        let windowHeight = $(window).height(),
            headerHeight = $('.header').height(),
            promoHeight = windowHeight - headerHeight;
        $('.promo').css('min-height', promoHeight + 'px');

        // Initializing the anchor link function
        let anchorLink = function (event) {

            let headerHeight = $('.header').height(),
                id = $(this).attr('href').replace(/^[^#]+/, '');
            let someCondition = function () {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: $(id).offset().top - headerHeight
                }, 10);
            };

            someCondition();
        };

        // Call function of the transition to the anchor link if click on the menu item
        $('.nav__menu-link, .footer__menu-link, .nav-link-js').on('click', anchorLink);

        // Click on anchor links from a non-home page and clearing the "hash" parameter of the address bar
        $(document).ready(function () {

            if (window.location.hash.length > 0) {
                let headerHeight = $('.header').height();
                $('html, body').animate({
                    scrollTop: $(window.location.hash).offset().top - headerHeight + 10
                }, 200);
                history.replaceState({}, document.title, window.location.href.split('#')[0]);
            }
        });

        // Mobile menu
        function menuToggle() {
            if (window.matchMedia('(max-width: 767px)').matches) {
                $('.nav__list').toggleClass('nav__list--active');
                $('.nav__btn-icon').toggleClass('nav__btn-icon--active');
                $('.nav__btn-field')
                    .toggleClass('nav__btn-field--active')
                    .attr('aria-label',
                        (_, attr) => attr === 'Open Menu' ? 'Close Menu' : 'Open Menu'
                    )
                    .attr('aria-expanded',
                        (_, attr) => attr === 'false' ? 'true' : 'false'
                    );
            }
        }

        $('.nav__btn-field').on('click', menuToggle);

        // Close mobile menu after press button "Escape"
        $(document).on('keyup', function (e) {
            if (e.key === 'Escape' && $('.nav__btn-field').attr('aria-label') === 'Close Menu') {
                menuToggle();
            }
        });

        $('.nav__item').on('click', function () {

            // Active state of a menu item
            $('.nav__menu-link').removeClass('nav__menu-link--active');
            $(this).find('.nav__menu-link').addClass('nav__menu-link--active');

            // Close mobile menu after click menu item
            menuToggle();
        });

        $(window).on('scroll', function () {

            // Show button "Up" after scroll 100px
            if ($(this).scrollTop() > 100) {
                $('.scroll-top').fadeIn();
            } else {
                $('.scroll-top').fadeOut();
            }

            // Sticky menu after scroll
            if (window.matchMedia('(min-width: 767px)').matches) {
                if ($(this).scrollTop() > $('.header').height()) {
                    $('.header').addClass('header--sticky');
                } else {
                    $('.header').removeClass('header--sticky');
                }
            }
        });

        // Button "Up"
        $('.scroll-top').on('click', function () {

            $('html, body').animate({
                scrollTop: 0
            }, 100);

            return false;
        });

        // Show thanking modal after click on the "Order" button
        $('.assortment__item-btn').on('click', function () {
            $('.modal__msg-thank.modal').toggleClass('modal--active');
            $('body').toggleClass('no-scroll');
        });

        // Modal close
        let modalClose = function () {
            $('.modal').toggleClass('modal--active');
            $('body').toggleClass('no-scroll');
        };

        $('.modal__close-btn, .modal__accept-btn, .modal__mask').on('click', modalClose);

        // Call active-menu-item function
        function scrollEvents() {
            const sections = document.querySelectorAll('section'),
                links = document.querySelectorAll('.nav__menu-link');

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            links.forEach((link) => {
                                const linkHref = link
                                    .getAttribute('href')
                                    // .replace(window.location.protocol + '//' + window.location.hostname + '#', '')
                                    .replace('index.html#', '');

                                if (linkHref === entry.target.id) {
                                    link.classList.add('nav__menu-link--active');
                                } else {
                                    link.classList.remove('nav__menu-link--active');
                                }
                            });
                        }
                    });
                },
                {threshold: .33}
            );

            sections.forEach((section) => {
                observer.observe(section);
            });
        }

        scrollEvents();

        // Slider of Preferences
        const preferencesSlider = $('.preferences__slider');
        if (preferencesSlider.length) {
            preferencesSlider.slick({
                speed: 1000,
                autoplay: true,
                autoplaySpeed: 5000,
                arrows: true,
                dots: false,
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                pauseOnHover: true,
                pauseOnFocus: true,
                responsive: [
                    {
                        breakpoint: 1366,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 767,
                        settings: {
                            slidesToShow: 1,
                            dots: false,
                        }
                    }
                ]
            });
        }

        // Convert address tags to google map links
        /*$('.footer__address').each(function () {
            let link = '<a class="footer__contacts-link" href="http://maps.google.com/maps?q=' + encodeURIComponent($(this).text()) + '" target="_blank">' + $(this).text() + '</a>';
            $(this).html(link);
        });*/
    });
})(jQuery);

function assortmentInit() {
    const assortmentsList = document.querySelector('.assortment__list');
    const assortmentItem = new Isotope(assortmentsList, {
        itemSelector: '.assortment__item',
        masonry: {
            fitWidth: true,
            gutter: 30
        }
    });

    document.addEventListener('click', documentAction);

    function documentAction(e) {
        const targetElement = e.target;
        if (targetElement.closest('.assortment__categories-item')) {
            const filterItem = targetElement.closest('.assortment__categories-item');
            const filterValue = filterItem.dataset.filter;
            const filterActiveItem = document.querySelector('.assortment__categories-item.active');

            filterValue === 'all'
                ? assortmentItem.arrange({filter: ``})
                : assortmentItem.arrange({filter: `[data-filter="${filterValue}"]`});

            filterActiveItem.classList.remove('active');
            filterItem.classList.add('active');

            e.preventDefault();
        }
    }
}

window.addEventListener('load', assortmentInit);

// Map
function initMap() {
    const centerLocation = {lat: 49.22310180771078, lng: 28.398134349481367};
    const bakeryLocation = {lat: 49.22436308170155, lng: 28.403970836411183};
    const markerIcon = 'img/map-marker-icon.svg';
    const contentString = document.getElementById('info-location').outerHTML;
    const mapSection = document.getElementById('map');
    const map = new google.maps.Map(mapSection, {
        zoom: 15,
        center: centerLocation,
    });

    const marker = new google.maps.Marker({
        position: bakeryLocation,
        map,
        title: 'Пекарня',
        icon: markerIcon,
        animation:google.maps.Animation.DROP,
    });

    const infoWindow = new google.maps.InfoWindow({
        content: contentString,
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });

    let addressLocation = document.getElementById('address-location'),
        headerSection = document.querySelector('header');
    addressLocation.addEventListener('click', () => {
        google.maps.event.trigger(marker, 'click');
        window.scroll(0, mapSection.offsetTop - headerSection.offsetHeight);
    })
}

window.initMap = initMap;

(() => {
    // Store old reference
    const appendChild = Element.prototype.appendChild;

    // All services to catch
    const urlCatchers = [
        '/AuthenticationService.Authenticate?',
        '/QuotaService.RecordEvent?'
    ];

    // Google Map is using JSONP.
    // So we only need to detect the services removing access and disabling them by not
    // inserting them inside the DOM
    Element.prototype.appendChild = function (element) {
        const isGMapScript =
            element.tagName === 'SCRIPT' &&
            /maps\.googleapis\.com/i.test(element.src);
        const isGMapAccessScript =
            isGMapScript && urlCatchers.some((url) => element.src.includes(url));

        if (!isGMapAccessScript) {
            return appendChild.call(this, element);
        }

        // Returns the element to be compliant with the appendChild API
        return element;
    };
})();
