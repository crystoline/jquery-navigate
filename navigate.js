/**
 * jQuery Navigate Plugin
 * Handles AJAX navigation, form submissions, and browser history management
 */

(function ($) {
    'use strict';

    // Configuration
    const CONFIG = {
        nProgress: {
            easing: 'ease',
            speed: 50,
            showSpinner: true,
            completeDelay: 1000
        },
        ajax: {
            timeout: 300000, // 5 minutes
            defaultDestination: '#content'
        }
    };

    /**
     * Initialize NProgress if available
     */
    function initializeNProgress() {
        if (typeof NProgress !== 'undefined') {
            NProgress.configure(CONFIG.nProgress);
        }
    }

    /**
     * Setup AJAX progress indicators
     */
    function setupAjaxProgress() {
        $(document)
            .ajaxStart(function () {
                if (typeof NProgress !== 'undefined') {
                    NProgress.set(0.4);
                    NProgress.start();
                }
            })
            .ajaxStop(function () {
                if (typeof NProgress !== 'undefined') {
                    NProgress.set(0.9);
                    setTimeout(() => {
                        NProgress.done();
                        NProgress.remove();
                    }, CONFIG.nProgress.completeDelay);
                }
            });
    }

    /**
     * Get base URL from meta tag
     * @returns {string} Base URL
     */
    function getBaseUrl() {
        return $('meta[name="base-url"]').attr('content') || '';
    }

    /**
     * Normalize URL by removing base URL prefix
     * @param {string} url - URL to normalize
     * @returns {string} Normalized URL
     */
    function normalizeUrl(url) {
        const baseUrl = getBaseUrl();
        if (!baseUrl || !url) {
            return url || '';
        }
        return url.indexOf(baseUrl) === 0 ? url.replace(baseUrl, '') : url;
    }

    /**
     * Build complete URL with base URL
     * @param {string} url - Relative URL
     * @returns {string} Complete URL
     */
    function buildCompleteUrl(url) {
        return getBaseUrl() + normalizeUrl(url);
    }

    /**
     * Perform AJAX request with given options
     * @param {Object} options - AJAX options
     */
    function doAjax(options) {
        const dest = $(options.dst);

        if (!dest.length) {
            console.error('Destination element not found:', options.dst);
            return;
        }

        const completeUrl = buildCompleteUrl(options.url);

        $.ajax({
            url: completeUrl,
            method: options.method || 'GET',
            data: options.data,
            cache: false,
            contentType: false,
            processData: false,
            timeout: CONFIG.ajax.timeout,

            success: function (data) {
                const attachMode = options.attach || 'replace';

                switch (attachMode) {
                    case 'prepend':
                        dest.prepend(data);
                        break;
                    case 'append':
                        dest.append(data);
                        break;
                    case 'replace':
                    default:
                        dest.html(data);
                }
            },

            error: function (xhr, ajaxOptions, thrownError) {
                handleAjaxError(xhr, thrownError, dest);
            },

            complete: function () {
                $('html, body').animate({ scrollTop: 0 }, 'slow');
            }
        });
    }

    /**
     * Handle AJAX errors
     * @param {Object} xhr - XMLHttpRequest object
     * @param {string} thrownError - Error message
     * @param {jQuery} dest - Destination element
     */
    function handleAjaxError(xhr, thrownError, dest) {
        const baseUrl = getBaseUrl();

        switch (xhr.status) {
            case 401:
                // Unauthorized - redirect to login
                window.location = baseUrl;
                break;

            default:
                const errorHtml = `
                    <div class="alert alert-warning alert-dismissible" role="alert" style="margin-top: 50px">
                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <strong>An Error Occurred!</strong> ${thrownError}
                    </div>
                `;

                const $msg = $(errorHtml);
                dest.html($msg);

                // Auto-dismiss error message
                $msg.fadeTo(5000, 500).slideUp(500, function () {
                    $(this).alert('close');
                });

                // Append response for debugging
                if (xhr.responseText) {
                    dest.append(xhr.responseText);
                }

                console.error('AJAX Error:', xhr);
        }
    }

    /**
     * Handle anchor click events
     * @param {Event} e - Click event
     */
    function handleAnchorClick(e) {
        e.preventDefault();

        const $obj = $(this);
        const url = $obj.attr('data-href') || $obj.attr('href') || '';

        if (!url) {
            console.warn('No URL found for anchor:', $obj);
            return;
        }

        const options = {
            url: url,
            method: 'GET',
            dst: $obj.attr('data-dst') || CONFIG.ajax.defaultDestination,
            data: {}
        };

        const title = $obj.attr('title') || url;

        doAjax(options);

        // Add to browser history (unless temporary)
        if (!$obj.attr('data-temp')) {
            history.pushState(
                options,
                title,
                `${getBaseUrl()}#${normalizeUrl(url)}`
            );
        }
    }

    /**
     * Handle form submit events
     * @param {Event} e - Submit event
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const $obj = $(this);
        const url = $obj.attr('action') || '';
        const method = ($obj.attr('method') || 'GET').toUpperCase();
        const dst = $obj.attr('data-dst') || CONFIG.ajax.defaultDestination;
        const attach = $obj.attr('data-attach') || 'replace';

        const data = new FormData($obj[0]);
        const title = $obj.attr('title') || url;

        const options = {
            url: url,
            method: method,
            dst: dst,
            data: data,
            attach: attach,
            cache: false
        };

        // Add to browser history for GET requests (unless temporary)
        if (!$obj.attr('data-temp') && method === 'GET') {
            const serializedData = $obj.serializeArray();
            const historyOptions = { ...options, data: serializedData };

            history.pushState(
                historyOptions,
                title,
                `${getBaseUrl()}#${normalizeUrl(url)}`
            );
        }

        doAjax(options);
    }

    /**
     * Handle browser back/forward navigation
     * @param {PopStateEvent} e - Popstate event
     */
    function handlePopState(e) {
        const options = e.state;

        if (options) {
            doAjax(options);
        }
    }

    /**
     * Handle "select all" checkbox functionality
     * @param {Event} e - Change event
     */
    function handleSelectAll(e) {
        e.preventDefault();

        const $checkbox = $(this);
        const $table = $checkbox.closest('table');
        const $checkboxes = $table.find(':checkbox:not([disabled])');

        $checkboxes.prop('checked', $checkbox.is(':checked'));
    }

    /**
     * Load content from URL hash on page load
     */
    function loadFromHash() {
        const hash = location.hash;

        if (hash) {
            const url = normalizeUrl(hash.replace('#', ''));
            const options = {
                url: buildCompleteUrl(url),
                method: 'GET',
                cache: false,
                dst: CONFIG.ajax.defaultDestination
            };

            doAjax(options);
        }
    }

    /**
     * Create and attach reload button
     */
    function createReloadButton() {
        const $reload = $(`
            <button id="navigate-reload" 
                    class="btn btn-primary" 
                    style="position: fixed; z-index: 1040; top: 100px; right: 10px"
                    title="Reload current page">
                <i class="fa fa-refresh"></i>
            </button>
        `);

        $('body').append($reload);

        $(document).on('click', '#navigate-reload', function (e) {
            e.preventDefault();

            const options = history.state;

            if (options) {
                doAjax(options);
            } else {
                console.log('No history state available for reload');
            }
        });
    }

    /**
     * Initialize all event handlers
     */
    function initializeEventHandlers() {
        // Anchor clicks
        $(document).on(
            'click',
            'a[data-ajax=true], [data-ajax-links] a',
            handleAnchorClick
        );

        // Form submissions
        $(document).on(
            'submit',
            'form[data-ajax=true]',
            handleFormSubmit
        );

        // Select all checkboxes
        $(document).on(
            'change',
            '.selectAll',
            handleSelectAll
        );

        // Browser navigation
        window.addEventListener('popstate', handlePopState);
    }

    /**
     * Initialize the plugin
     */
    function initialize() {
        initializeNProgress();
        setupAjaxProgress();
        initializeEventHandlers();
        createReloadButton();
        loadFromHash();
    }

    // Initialize on document ready
    $(initialize);

})(jQuery);