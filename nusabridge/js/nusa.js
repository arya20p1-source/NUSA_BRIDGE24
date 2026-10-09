/**
 * NUSABRIDGE - Platform Ekosistem Ekspor UMKM Indonesia
 * Interactive JavaScript: Sticky Header, Visualizations, KYC Hub,
 * Elevated RFQ & Trade Negotiation Studio, Escrow Simulator & Customs Tracker
 */

document.addEventListener('DOMContentLoaded', function () {
    // --------------------------------------------------------------------------
    // 1. STICKY NAVBAR - Menjamin menu tidak pernah tenggelam/hilang saat scroll
    // --------------------------------------------------------------------------
    // 1. RESPONSIVE STICKY ISLAND NAVBAR & MOBILE MENU CONTROLLER
    // --------------------------------------------------------------------------
    const navbarIsland = document.getElementById('nusaNavbarIsland') || document.querySelector('.nusa-navbar-island') || document.querySelector('.navbar');
    const navCollapse = document.getElementById('navbarCollapse');
    const navToggler = document.querySelector('.navbar-toggler-custom');
    
    function handleNavbarScroll() {
        if (!navbarIsland) return;
        if (window.scrollY > 20) {
            navbarIsland.classList.add('scrolled', 'shadow-sm');
        } else {
            navbarIsland.classList.remove('scrolled', 'shadow-sm');
        }
    }
    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll();

    function closeMobileMenu() {
        if (navCollapse && navCollapse.classList.contains('show')) {
            if (window.bootstrap && bootstrap.Collapse) {
                const bsCollapse = bootstrap.Collapse.getInstance(navCollapse) || new bootstrap.Collapse(navCollapse, { toggle: false });
                bsCollapse.hide();
            } else if (window.jQuery) {
                $(navCollapse).collapse('hide');
            } else {
                navCollapse.classList.remove('show');
            }
            if (navToggler) {
                navToggler.classList.add('collapsed');
                navToggler.setAttribute('aria-expanded', 'false');
            }
        }
    }

    // Smooth scroll for nav items with sticky header offset compensation
    const navLinks = document.querySelectorAll('a.nav-link[href^="#"], a.btn[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const navHeight = navbarIsland ? navbarIsland.offsetHeight : 75;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navHeight - 12;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Auto-close mobile navbar on link click
                closeMobileMenu();
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth < 992 && navCollapse && navCollapse.classList.contains('show')) {
            if (navbarIsland && !navbarIsland.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });

    // Scrollspy highlight active menu item
    const sections = document.querySelectorAll('section[id], div[id].nusa-section');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const navHeight = navbarIsland ? navbarIsland.offsetHeight : 75;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - navHeight - 60;
            const sectionId = current.getAttribute('id');
            const targetNavLink = document.querySelector(`#nusaNavbarIsland .nav-link[href*="${sectionId}"]`) || document.querySelector(`.navbar .nav-link[href*="${sectionId}"]`);

            if (targetNavLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('#nusaNavbarIsland .nav-link').forEach(nl => nl.classList.remove('active'));
                    targetNavLink.classList.add('active');
                }
            }
        });
    });

    // --------------------------------------------------------------------------
    // 2. DIAGRAM BATANG & STATISTIK AGREGAT EKSPOR UMKM DAERAH
    // --------------------------------------------------------------------------
    let exportChartInstance = null;
    const ctxExport = document.getElementById('exportBarChart');

    const regionalExportData = {
        all: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [14.8, 12.6, 9.4, 8.2, 7.5, 6.1, 4.8], // Juta USD
            volumeTon: [1420, 1180, 720, 890, 840, 560, 410]   // Ton
        },
        butter: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [5.8, 4.9, 2.7, 3.1, 2.4, 3.8, 1.2],
            volumeTon: [520, 430, 210, 310, 240, 390, 110]
        },
        spices: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [4.2, 3.8, 4.5, 2.6, 3.1, 1.2, 2.9],
            volumeTon: [410, 360, 320, 280, 330, 90, 230]
        },
        coffee: {
            labels: ['Jawa Barat', 'Jawa Timur', 'Bali', 'Sulawesi Selatan', 'Sumatera Utara', 'Kalimantan Timur', 'Maluku'],
            valuesUSD: [4.8, 3.9, 2.2, 2.5, 2.0, 1.1, 0.7],
            volumeTon: [490, 390, 190, 300, 270, 80, 70]
        }
    };

    function renderExportChart(category = 'all') {
        if (!ctxExport) return;
        const data = regionalExportData[category] || regionalExportData.all;

        if (exportChartInstance) {
            exportChartInstance.destroy();
        }

        exportChartInstance = new Chart(ctxExport, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Nilai Ekspor (Juta USD)',
                        data: data.valuesUSD,
                        backgroundColor: 'rgba(15, 118, 110, 0.88)',
                        borderColor: '#0F766E',
                        borderWidth: 1.5,
                        borderRadius: 8,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Volume Ekspor (Ton)',
                        data: data.volumeTon,
                        backgroundColor: 'rgba(217, 119, 6, 0.82)',
                        borderColor: '#D97706',
                        borderWidth: 1.5,
                        borderRadius: 8,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: { family: "'Inter', sans-serif", weight: '600', size: 12 },
                            usePointStyle: true,
                            padding: 18
                        }
                    },
                    tooltip: {
                        backgroundColor: '#0B132B',
                        padding: 12,
                        titleFont: { size: 13, weight: 'bold' },
                        bodyFont: { size: 12 },
                        cornerRadius: 8,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.datasetIndex === 0) {
                                    label += '$' + context.parsed.y + ' Juta USD';
                                } else {
                                    label += context.parsed.y.toLocaleString() + ' Ton';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { weight: '600' } }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Nilai (Juta USD)', font: { size: 11, weight: '600' } },
                        grid: { color: 'rgba(226, 232, 240, 0.6)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Volume (Ton)', font: { size: 11, weight: '600' } },
                        grid: { drawOnChartArea: false }
                    }
                }
            }
        });
    }

    function initCharts() {
        if (typeof Chart === 'undefined') {
            setTimeout(initCharts, 80);
            return;
        }
        if (ctxExport) {
            renderExportChart('all');
        }
        if (ctxEscrow) {
            renderEscrowDoughnut();
        }
    }
    initCharts();

    // Filter Buttons for Export Chart (supports both pill and btn classes)
    const chartFilterBtns = document.querySelectorAll('.chart-filter-btn, .chart-filter-pill');
    chartFilterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            chartFilterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            renderExportChart(category);
        });
    });

    // --------------------------------------------------------------------------
    // 3. VISUALISASI DATA & SIMULASI ESCROW
    // --------------------------------------------------------------------------
    let escrowDoughnutInstance = null;
    const ctxEscrow = document.getElementById('escrowMilestoneChart');

    function renderEscrowDoughnut() {
        if (!ctxEscrow) return;
        if (escrowDoughnutInstance) escrowDoughnutInstance.destroy();

        escrowDoughnutInstance = new Chart(ctxEscrow, {
            type: 'doughnut',
            data: {
                labels: [
                    'Tahap 1: Uang Muka Produksi (30%)',
                    'Tahap 2: Hasil Inspeksi Mutu QC (30%)',
                    'Tahap 3: Bea Cukai PEB & Gate-In (20%)',
                    'Tahap 4: B/L On-Board Pelayaran (20%)'
                ],
                datasets: [{
                    data: [30, 30, 20, 20],
                    backgroundColor: [
                        '#0F766E', // Emerald
                        '#14B8A6', // Teal
                        '#D97706', // Gold
                        '#2563EB'  // Blue
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            padding: 12,
                            font: { size: 11, weight: '600' }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ` ${context.label}: ${context.raw}% dari Kontrak`;
                            }
                        }
                    }
                },
                cutout: '68%'
            }
        });
    }

    if (ctxEscrow) {
        renderEscrowDoughnut();
    }

    // Interactive Escrow Simulator Slider
    const escrowSlider = document.getElementById('escrowAmountRange');
    const displayAmount = document.getElementById('escrowDisplayAmount');
    const statDp = document.getElementById('escrowStatDP');
    const statQc = document.getElementById('escrowStatQC');
    const statCustoms = document.getElementById('escrowStatCustoms');
    const statBL = document.getElementById('escrowStatBL');
    const statFee = document.getElementById('escrowStatFee');

    function updateEscrowCalculations(val) {
        const amount = parseInt(val, 10);
        if (displayAmount) displayAmount.textContent = '$' + amount.toLocaleString() + ' USD';
        
        const dp = amount * 0.30;
        const qc = amount * 0.30;
        const customs = amount * 0.20;
        const bl = amount * 0.20;
        const fee = amount * 0.005; // 0.5% fee

        if (statDp) statDp.textContent = '$' + dp.toLocaleString();
        if (statQc) statQc.textContent = '$' + qc.toLocaleString();
        if (statCustoms) statCustoms.textContent = '$' + customs.toLocaleString();
        if (statBL) statBL.textContent = '$' + bl.toLocaleString();
        if (statFee) statFee.textContent = '$' + fee.toLocaleString() + ' (0.5%)';

        if (escrowDoughnutInstance && escrowDoughnutInstance.options && escrowDoughnutInstance.options.plugins && escrowDoughnutInstance.options.plugins.tooltip) {
            escrowDoughnutInstance.options.plugins.tooltip.callbacks.label = function (context) {
                const pct = context.raw;
                const usd = (amount * pct / 100).toLocaleString();
                return ` ${context.label}: $${usd} USD (${pct}%)`;
            };
            escrowDoughnutInstance.update('none');
        }
    }

    if (escrowSlider) {
        escrowSlider.addEventListener('input', function () {
            updateEscrowCalculations(this.value);
        });
        updateEscrowCalculations(escrowSlider.value || 50000);
    }

    // --------------------------------------------------------------------------
    // 4. KYC HUB & VERIFIKASI LEGALITAS (NIB/NPWP)
    // --------------------------------------------------------------------------
    const btnSampleUmkm1 = document.getElementById('btnSampleUmkm1');
    const btnSampleUmkm2 = document.getElementById('btnSampleUmkm2');
    const inputNib = document.getElementById('inputNib');
    const inputNpwp = document.getElementById('inputNpwp');
    const btnVerifyKyc = document.getElementById('btnVerifyKyc');
    const kycResultPlaceholder = document.getElementById('kycResultPlaceholder');
    const kycLoading = document.getElementById('kycLoading');
    const kycResultBox = document.getElementById('kycResultBox');

    if (btnSampleUmkm1) {
        btnSampleUmkm1.addEventListener('click', function () {
            if (inputNib) inputNib.value = '0220108740123';
            if (inputNpwp) inputNpwp.value = '81.423.518.2-429.000';
            triggerKycVerification('PT Nusa Java Organik (Artisan Cocoa & Shea Butter)', '0220108740123', '81.423.518.2-429.000', 'Bandung, Jawa Barat', 'KBLI 10732 (Pengolahan Kakao & Mentega Nabati)');
        });
    }

    if (btnSampleUmkm2) {
        btnSampleUmkm2.addEventListener('click', function () {
            if (inputNib) inputNib.value = '0220109923841';
            if (inputNpwp) inputNpwp.value = '92.114.823.1-901.000';
            triggerKycVerification('CV Bali Spice & Gourmet Organics', '0220109923841', '92.114.823.1-901.000', 'Gianyar, Bali', 'KBLI 10772 (Industri Rempah & Bumbu Ekspor)');
        });
    }

    if (btnVerifyKyc) {
        btnVerifyKyc.addEventListener('click', function () {
            const nibVal = inputNib ? inputNib.value.trim() : '';
            const npwpVal = inputNpwp ? inputNpwp.value.trim() : '';
            if (!nibVal || !npwpVal) {
                alert('Silakan masukkan nomor NIB dan NPWP atau klik tombol sampel.');
                return;
            }
            triggerKycVerification('PT Nusantara Butter & Agrikultur Terpadu', nibVal, npwpVal, 'Surabaya, Jawa Timur', 'KBLI 10732 (Industri Olahan Lemak & Mentega Nabati)');
        });
    }

    function triggerKycVerification(companyName, nib, npwp, address, kbli) {
        if (kycResultPlaceholder) kycResultPlaceholder.style.display = 'none';
        if (kycResultBox) kycResultBox.style.display = 'none';
        if (kycLoading) kycLoading.style.display = 'block';

        setTimeout(() => {
            if (kycLoading) kycLoading.style.display = 'none';
            if (kycResultBox) {
                kycResultBox.style.display = 'block';
                document.getElementById('resCompanyName').textContent = companyName;
                document.getElementById('resNib').textContent = nib;
                document.getElementById('resNpwp').textContent = npwp;
                document.getElementById('resAddress').textContent = address;
                document.getElementById('resKbli').textContent = kbli;
            }
        }, 700);
    }

    // --------------------------------------------------------------------------
    // 5. ELEVATED RFQ STUDIO & EXPORT CONTRACT GENERATOR
    // --------------------------------------------------------------------------
    const scenarioBtns = document.querySelectorAll('.scenario-pill-btn, .rfq-scenario-btn');
    const docTypeSelect = document.getElementById('docTypeSelect');
    const docExporterInput = document.getElementById('docExporterInput');
    const docBuyerInput = document.getElementById('docBuyerInput');
    const docCommoditySelect = document.getElementById('docCommoditySelect');
    const docVolumeInput = document.getElementById('docVolumeInput');
    const docPriceInput = document.getElementById('docPriceInput');
    const docIncotermSelect = document.getElementById('docIncotermSelect');
    const docPortLoading = document.getElementById('docPortLoading');
    const docPortDischarge = document.getElementById('docPortDischarge');
    const btnSimulateSendQuote = document.getElementById('btnSimulateSendQuote');
    const btnPrintDoc = document.getElementById('btnPrintDoc');

    // Cost Breakdown Elements
    const costRawMaterial = document.getElementById('costRawMaterial');
    const costPackaging = document.getElementById('costPackaging');
    const costLogistics = document.getElementById('costLogistics');
    const costCustoms = document.getElementById('costCustoms');
    const costMargin = document.getElementById('costMargin');
    const incotermFreightDesc = document.getElementById('incotermFreightDesc');
    const incotermInsuranceDesc = document.getElementById('incotermInsuranceDesc');
    const incotermRiskDesc = document.getElementById('incotermRiskDesc');

    // Scenarios data
    const rfqScenarios = {
        sc1: {
            exporter: 'PT Nusa Java Organik, Bandung',
            buyer: 'Bavaria Gourmet Import GmbH, Hamburg, Germany',
            commodity: 'Artisan Pure Java Cocoa Butter & Shea Butter (200g Glass Jar & Bulk)',
            volume: 5000,
            price: 12.50,
            incoterm: 'FOB Tanjung Priok, Jakarta (Incoterms 2020)',
            pol: 'Port of Tanjung Priok, Jakarta (IDTPP)',
            pod: 'Port of Hamburg, Germany (DEHAM)',
            specs: 'Fat Content 52-54%, FFA < 1.75%, Melting Point 34-36°C, Moisture < 0.2%'
        },
        sc2: {
            exporter: 'CV Kalimantan Organics Nusantara, Pontianak',
            buyer: 'Tokyo Organic Care Corp, Yokohama, Japan',
            commodity: 'Natural Unrefined Shea Butter & Raw Illipe Butter Bulk',
            volume: 6000,
            price: 14.00,
            incoterm: 'CIF Yokohama Port, Japan (Incoterms 2020)',
            pol: 'Port of Tanjung Priok, Jakarta (IDTPP)',
            pod: 'Port of Yokohama, Japan (JPYOK)',
            specs: '100% Cold Pressed, Saponification Value 180-195, Peroxide < 2.0 meq/kg'
        },
        sc3: {
            exporter: 'CV Bali Gourmet Spice & Vanilla, Gianyar',
            buyer: 'Amsterdam Spice & Flavour Traders B.V., Netherlands',
            commodity: 'Organic Gourmet Bourbon Vanilla Beans & Clove Spice',
            volume: 1500,
            price: 30.00,
            incoterm: 'CFR Rotterdam Port, Netherlands (Incoterms 2020)',
            pol: 'Port of Tanjung Perak, Surabaya (IDTPS)',
            pod: 'Port of Rotterdam, Netherlands (NLRTM)',
            specs: 'Vanillin Content > 2.2%, Length 18-20cm, Moisture 30-33%, Gourmet Grade 1'
        }
    };

    function loadRfqScenario(scKey) {
        const sc = rfqScenarios[scKey];
        if (!sc) return;

        if (docExporterInput) docExporterInput.value = sc.exporter;
        if (docBuyerInput) docBuyerInput.value = sc.buyer;
        if (docCommoditySelect) docCommoditySelect.value = sc.commodity;
        if (docVolumeInput) docVolumeInput.value = sc.volume;
        if (docPriceInput) docPriceInput.value = sc.price;
        if (docIncotermSelect) docIncotermSelect.value = sc.incoterm;
        if (docPortLoading) docPortLoading.value = sc.pol;
        if (docPortDischarge) docPortDischarge.value = sc.pod;

        updateRfqCalculationsAndDocument(sc.specs);
    }

    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            scenarioBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const scKey = this.getAttribute('data-scenario');
            loadRfqScenario(scKey);
        });
    });

    function updateRfqCalculationsAndDocument(customSpecs = null) {
        const docType = docTypeSelect ? docTypeSelect.value : 'Proforma Invoice';
        const exporter = docExporterInput ? docExporterInput.value : 'PT Nusa Java Organik';
        const buyer = docBuyerInput ? docBuyerInput.value : 'Bavaria Gourmet Import GmbH';
        const commodity = docCommoditySelect ? docCommoditySelect.value : 'Artisan Pure Java Cocoa Butter & Shea Butter';
        const volume = parseFloat(docVolumeInput ? docVolumeInput.value : 5000) || 5000;
        const price = parseFloat(docPriceInput ? docPriceInput.value : 12.50) || 12.50;
        const incoterm = docIncotermSelect ? docIncotermSelect.value : 'FOB Tanjung Priok, Jakarta';
        const pol = docPortLoading ? docPortLoading.value : 'Port of Tanjung Priok (IDTPP)';
        const pod = docPortDischarge ? docPortDischarge.value : 'Port of Hamburg (DEHAM)';

        const totalValue = volume * price;

        // Dynamic Cost Breakdown Simulation (Per unit & Total)
        const unitRaw = price * 0.58;       // 58% Bahan baku petani UMKM
        const unitPack = price * 0.12;      // 12% Kemasan ekspor food grade
        const unitLogistics = price * 0.08; // 8% Trucking & THC Pelabuhan
        const unitCustoms = price * 0.04;   // 4% PEB & Uji Karantina/Fumigasi
        const unitProfit = price * 0.18;    // 18% Keuntungan bersih UMKM

        if (costRawMaterial) costRawMaterial.textContent = '$' + (unitRaw * volume).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' ($' + unitRaw.toFixed(2) + '/u)';
        if (costPackaging) costPackaging.textContent = '$' + (unitPackagingText(unitPack, volume));
        if (costLogistics) costLogistics.textContent = '$' + (unitLogistics * volume).toLocaleString(undefined, { maximumFractionDigits: 0 });
        if (costCustoms) costCustoms.textContent = '$' + (unitCustoms * volume).toLocaleString(undefined, { maximumFractionDigits: 0 });
        if (costMargin) costMargin.textContent = '$' + (unitProfit * volume).toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' (18% Margin Bersih)';

        // Incoterms 2020 Matrix description update
        if (incoterm.includes('FOB')) {
            if (incotermFreightDesc) incotermFreightDesc.innerHTML = '<span class="text-info fw-bold">Ditanggung BUYER</span> (Setelah kontainer di atas kapal)';
            if (incotermInsuranceDesc) incotermInsuranceDesc.innerHTML = '<span class="text-info fw-bold">Ditanggung BUYER</span> (Opsional asuransi maritim)';
            if (incotermRiskDesc) incotermRiskDesc.innerHTML = '<span class="text-success fw-bold">Beralih ke Buyer</span> saat kontainer melewati rail kapal di Pelabuhan Muat';
        } else if (incoterm.includes('CIF')) {
            if (incotermFreightDesc) incotermFreightDesc.innerHTML = '<span class="text-primary fw-bold">Dibayar SELLER (UMKM)</span> sampai pelabuhan tujuan';
            if (incotermInsuranceDesc) incotermInsuranceDesc.innerHTML = '<span class="text-primary fw-bold">Dibayar SELLER (UMKM)</span> Asuransi Marine Cargo Clause C/A';
            if (incotermRiskDesc) incotermRiskDesc.innerHTML = '<span class="text-success fw-bold">Risiko beralih ke Buyer</span> saat kapal berlayar';
        } else if (incoterm.includes('CFR')) {
            if (incotermFreightDesc) incotermFreightDesc.innerHTML = '<span class="text-primary fw-bold">Dibayar SELLER (UMKM)</span> sampai pelabuhan tujuan';
            if (incotermInsuranceDesc) incotermInsuranceDesc.innerHTML = '<span class="text-info fw-bold">Ditanggung BUYER</span> secara mandiri';
            if (incotermRiskDesc) incotermRiskDesc.innerHTML = '<span class="text-success fw-bold">Risiko beralih ke Buyer</span> saat barang on-board kapal';
        } else {
            if (incotermFreightDesc) incotermFreightDesc.innerHTML = '<span class="text-info fw-bold">Ditanggung BUYER 100%</span> dari pintu pabrik UMKM';
            if (incotermInsuranceDesc) incotermInsuranceDesc.innerHTML = '<span class="text-info fw-bold">Ditanggung BUYER</span>';
            if (incotermRiskDesc) incotermRiskDesc.innerHTML = '<span class="text-warning fw-bold">Risiko beralih</span> langsung di gudang UMKM';
        }

        // Populate official preview sheet
        const previewTitle = document.getElementById('docPreviewTitle');
        const previewNumber = document.getElementById('docPreviewNumber');
        const previewDate = document.getElementById('docPreviewDate');
        const previewExporter = document.getElementById('docPreviewExporter');
        const previewBuyer = document.getElementById('docPreviewBuyer');
        const previewIncoterm = document.getElementById('docPreviewIncoterm');
        const previewPOL = document.getElementById('docPreviewPOL');
        const previewPOD = document.getElementById('docPreviewPOD');
        const previewCommodity = document.getElementById('docPreviewCommodity');
        const previewSpecs = document.getElementById('docPreviewSpecs');
        const previewQty = document.getElementById('docPreviewQty');
        const previewPrice = document.getElementById('docPreviewPrice');
        const previewTotal = document.getElementById('docPreviewTotal');
        const previewGrandTotal = document.getElementById('docPreviewGrandTotal');

        if (previewTitle) previewTitle.textContent = docType.toUpperCase();
        if (previewNumber) {
            const prefix = docType.includes('RFQ') ? 'RFQ' : (docType.includes('Invoice') ? 'PI' : 'SC');
            previewNumber.textContent = `${prefix}-NB-2026-${Math.floor(2000 + (volume % 7000))}`;
        }
        if (previewDate) {
            const now = new Date();
            previewDate.textContent = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
        if (previewExporter) previewExporter.textContent = exporter;
        if (previewBuyer) previewBuyer.textContent = buyer;
        if (previewIncoterm) previewIncoterm.textContent = incoterm;
        if (previewPOL) previewPOL.textContent = pol;
        if (previewPOD) previewPOD.textContent = pod;
        if (previewCommodity) previewCommodity.textContent = commodity;
        if (previewSpecs && customSpecs) previewSpecs.textContent = customSpecs;
        if (previewQty) previewQty.textContent = volume.toLocaleString() + ' Units / Kg';
        if (previewPrice) previewPrice.textContent = '$' + price.toFixed(2) + ' USD';
        if (previewTotal) previewTotal.textContent = '$' + totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 });
        if (previewGrandTotal) previewGrandTotal.textContent = '$' + totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' USD';
    }

    function unitPackagingText(unitPack, volume) {
        return (unitPack * volume).toLocaleString(undefined, { maximumFractionDigits: 0 });
    }

    // Attach real-time input change listeners
    [docTypeSelect, docExporterInput, docBuyerInput, docCommoditySelect, docVolumeInput, docPriceInput, docIncotermSelect, docPortLoading, docPortDischarge].forEach(elem => {
        if (elem) {
            elem.addEventListener('input', () => updateRfqCalculationsAndDocument());
            elem.addEventListener('change', () => updateRfqCalculationsAndDocument());
        }
    });

    if (btnSimulateSendQuote) {
        btnSimulateSendQuote.addEventListener('click', function () {
            const buyer = docBuyerInput ? docBuyerInput.value : 'Buyer Luar Negeri';
            const total = document.getElementById('docPreviewGrandTotal') ? document.getElementById('docPreviewGrandTotal').textContent : '$62,500.00 USD';
            
            // Show interactive simulation success toast
            const alertBox = document.getElementById('rfqSimulationAlert');
            if (alertBox) {
                alertBox.innerHTML = `
                    <div class="alert alert-success border-success shadow-sm rounded-4 p-3 d-flex align-items-center mb-0 animate__animated animate__fadeIn">
                        <i class="fas fa-check-circle fs-3 text-success me-3"></i>
                        <div>
                            <strong class="d-block text-dark">Simulasi Berhasil! Penawaran Resmi Telah Dikirim ke ${buyer}</strong>
                            <span class="small text-secondary">Nilai Kontrak: <strong>${total}</strong> • Buyer merespons positif: <em>"Penawaran disetujui. Siap menyetor 100% dana ke NusaBridge Escrow Vault."</em></span>
                        </div>
                    </div>
                `;
                alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    if (btnPrintDoc) {
        btnPrintDoc.addEventListener('click', function () {
            window.print();
        });
    }

    // Initialize default scenario 1
    updateRfqCalculationsAndDocument();

    // --------------------------------------------------------------------------
    // 6. DASHBOARD LOGISTIK & KEPABEANAN (Tracking B/L, PEB/PIB)
    // --------------------------------------------------------------------------
    const btnTrackShipment = document.getElementById('btnTrackShipment');
    const inputTrackingNumber = document.getElementById('inputTrackingNumber');
    const btnSampleBL = document.getElementById('btnSampleBL');
    const btnSamplePEB = document.getElementById('btnSamplePEB');
    const trackingResultBox = document.getElementById('trackingResultBox');

    if (btnSampleBL) {
        btnSampleBL.addEventListener('click', function () {
            if (inputTrackingNumber) inputTrackingNumber.value = 'BL-IDN-2026-8890';
            executeTracking('BL-IDN-2026-8890', 'Bill of Lading (B/L)', 'PT Nusa Java Cocoa Butter', 'MV Nusantara Pride Voy 104N', 'Tanjung Priok -> Port of Hamburg', 'Dalam Pelayaran Samudera (In-Transit)');
        });
    }

    if (btnSamplePEB) {
        btnSamplePEB.addEventListener('click', function () {
            if (inputTrackingNumber) inputTrackingNumber.value = 'PEB-040300-2026-004123';
            executeTracking('PEB-040300-2026-004123', 'Pemberitahuan Ekspor Barang (PEB)', 'CV Bali Spice Organics', 'KPU Bea dan Cukai Tanjung Perak', 'Surabaya -> Yokohama Port', 'Jalur Hijau (SPE Diterbitkan)');
        });
    }

    if (btnTrackShipment) {
        btnTrackShipment.addEventListener('click', function () {
            const trackVal = inputTrackingNumber ? inputTrackingNumber.value.trim() : '';
            if (!trackVal) {
                alert('Silakan masukkan nomor B/L atau PEB terlebih dahulu.');
                return;
            }
            executeTracking(trackVal, trackVal.startsWith('PEB') ? 'Pemberitahuan Ekspor Barang' : 'Bill of Lading (B/L)', 'UMKM Terverifikasi NusaBridge', 'MV Meratus Java V-209', 'Tanjung Priok -> Singapore Transshipment', 'Dalam Proses Logistik Terverifikasi');
        });
    }

    function executeTracking(number, type, exporter, carrier, route, statusBadge) {
        if (trackingResultBox) {
            trackingResultBox.style.display = 'block';
            document.getElementById('trackDisplayNumber').textContent = number;
            document.getElementById('trackDisplayType').textContent = type;
            document.getElementById('trackDisplayExporter').textContent = exporter;
            document.getElementById('trackDisplayCarrier').textContent = carrier;
            document.getElementById('trackDisplayRoute').textContent = route;
            document.getElementById('trackDisplayStatus').textContent = statusBadge;
        }
    }

    // --------------------------------------------------------------------------
    // 7. ROLE TAB SWITCHER
    // --------------------------------------------------------------------------
    const roleBtns = document.querySelectorAll('.role-pill-btn');
    const roleCards = document.querySelectorAll('.role-content-pane');

    roleBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            roleBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const targetRole = this.getAttribute('data-role');

            roleCards.forEach(pane => {
                if (pane.getAttribute('id') === `role-${targetRole}`) {
                    pane.style.display = 'block';
                } else {
                    pane.style.display = 'none';
                }
            });
        });
    });

    // ==========================================================================
    // 8. PROMPT ALIGNED MODULES: SHOWROOM, KYC VALIDATION, RFQ STEPPER, ESCROW
    // ==========================================================================

    // --------------------------------------------------------------------------
    // A. SHOWROOM COMMODITY SELECTOR (Sub-bab 2.3 & 3.1)
    // --------------------------------------------------------------------------
    const commodityButtons = document.querySelectorAll('.btn-select-commodity');
    const step1CommoditySelect = document.getElementById('step1CommoditySelect');
    const step1QuantityInput = document.getElementById('step1QuantityInput');
    const step1TargetPriceInput = document.getElementById('step1TargetPriceInput');
    const step2IncotermSelect = document.getElementById('step2IncotermSelect');
    const step2PolInput = document.getElementById('step2PolInput');
    const step2PodInput = document.getElementById('step2PodInput');

    commodityButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const comm = this.getAttribute('data-commodity');
            const moq = this.getAttribute('data-moq');
            const price = this.getAttribute('data-price');
            const incoterm = this.getAttribute('data-incoterm');
            const pol = this.getAttribute('data-pol');
            const pod = this.getAttribute('data-pod');

            if (step1CommoditySelect && comm) step1CommoditySelect.value = comm;
            if (step1QuantityInput && moq) step1QuantityInput.value = moq;
            if (step1TargetPriceInput && price) step1TargetPriceInput.value = price;
            if (step2IncotermSelect && incoterm) step2IncotermSelect.value = incoterm;
            if (step2PolInput && pol) step2PolInput.value = pol;
            if (step2PodInput && pod) step2PodInput.value = pod;

            // Update calculations and jump to RFQ Step 1
            updateRfqStep1Calculation();
            updateIncotermResponsibilityMatrix();
            switchRfqStep(1);

            // Smooth scroll to RFQ Engine
            const rfqElem = document.getElementById('rfq-engine');
            if (rfqElem) {
                rfqElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --------------------------------------------------------------------------
    // B. KYC SELLER VALIDATION (15 & 16 Digit Format Validation)
    // --------------------------------------------------------------------------
    const kycNibInput = document.getElementById('kycNibInput');
    const kycNpwpInput = document.getElementById('kycNpwpInput');
    const kycNibValidationFeedback = document.getElementById('kycNibValidationFeedback');
    const kycNpwpValidationFeedback = document.getElementById('kycNpwpValidationFeedback');
    const kycNibCounterBadge = document.getElementById('kycNibCounterBadge');
    const kycNpwpCounterBadge = document.getElementById('kycNpwpCounterBadge');
    const btnSample15Digit = document.getElementById('btnSample15Digit');
    const btnSample16Digit = document.getElementById('btnSample16Digit');
    const btnVerifySellerKyc = document.getElementById('btnVerifySellerKyc');
    const kycAlertPlaceholder = document.getElementById('kycAlertPlaceholder');
    const profileNibDisplay = document.getElementById('profileNibDisplay');
    const profileNpwpDisplay = document.getElementById('profileNpwpDisplay');
    const profileNibBadge = document.getElementById('profileNibBadge');
    const profileNpwpBadge = document.getElementById('profileNpwpBadge');
    const sellerProfileVerifiedBadge = document.getElementById('sellerProfileVerifiedBadge');

    function validateIdFormat(inputElem, feedbackElem, counterBadge, typeLabel) {
        if (!inputElem || !feedbackElem) return false;
        const raw = inputElem.value;
        const digits = raw.replace(/\D/g, '');

        if (counterBadge) {
            counterBadge.textContent = `${digits.length} Digit`;
        }

        if (digits.length === 0) {
            feedbackElem.className = 'kyc-validation-feedback kyc-info';
            feedbackElem.innerHTML = `<i class="fas fa-info-circle me-1"></i>Format valid: 15 digit (standar lama) atau 16 digit (standar baru PMK 112/OSS).`;
            return false;
        } else if (digits.length === 15) {
            feedbackElem.className = 'kyc-validation-feedback kyc-valid';
            feedbackElem.innerHTML = `<i class="fas fa-check-circle me-1"></i>✓ Format valid: 15 digit terdeteksi (Format Standar Nasional Lama).`;
            return true;
        } else if (digits.length === 16) {
            feedbackElem.className = 'kyc-validation-feedback kyc-valid';
            feedbackElem.innerHTML = `<i class="fas fa-check-circle me-1"></i>✓ Format valid: 16 digit terdeteksi (Format Baru Standar NIK PMK 112 / OSS Terpadu).`;
            return true;
        } else {
            feedbackElem.className = 'kyc-validation-feedback kyc-invalid';
            feedbackElem.innerHTML = `<i class="fas fa-exclamation-triangle me-1"></i>Format ${typeLabel} belum sesuai. Wajib 15 atau 16 digit angka (Saat ini: ${digits.length} digit).`;
            return false;
        }
    }

    if (kycNibInput) {
        kycNibInput.addEventListener('input', () => validateIdFormat(kycNibInput, kycNibValidationFeedback, kycNibCounterBadge, 'NIB'));
        validateIdFormat(kycNibInput, kycNibValidationFeedback, kycNibCounterBadge, 'NIB');
    }

    if (kycNpwpInput) {
        kycNpwpInput.addEventListener('input', () => validateIdFormat(kycNpwpInput, kycNpwpValidationFeedback, kycNpwpCounterBadge, 'NPWP'));
        validateIdFormat(kycNpwpInput, kycNpwpValidationFeedback, kycNpwpCounterBadge, 'NPWP');
    }

    if (btnSample15Digit) {
        btnSample15Digit.addEventListener('click', function () {
            if (kycNibInput) kycNibInput.value = '022010874012300';
            if (kycNpwpInput) kycNpwpInput.value = '814235182429000';
            validateIdFormat(kycNibInput, kycNibValidationFeedback, kycNibCounterBadge, 'NIB');
            validateIdFormat(kycNpwpInput, kycNpwpValidationFeedback, kycNpwpCounterBadge, 'NPWP');
            if (kycAlertPlaceholder) {
                kycAlertPlaceholder.innerHTML = `<div class="alert alert-info py-2 small mb-0 rounded-3"><i class="fas fa-info-circle me-1"></i>Sampel 15 digit dimuat (Format Standar Lama). Klik "Verifikasi Legalitas" untuk menguji.</div>`;
            }
        });
    }

    if (btnSample16Digit) {
        btnSample16Digit.addEventListener('click', function () {
            if (kycNibInput) kycNibInput.value = '0220108740123000';
            if (kycNpwpInput) kycNpwpInput.value = '0814235182429000';
            validateIdFormat(kycNibInput, kycNibValidationFeedback, kycNibCounterBadge, 'NIB');
            validateIdFormat(kycNpwpInput, kycNpwpValidationFeedback, kycNpwpCounterBadge, 'NPWP');
            if (kycAlertPlaceholder) {
                kycAlertPlaceholder.innerHTML = `<div class="alert alert-success py-2 small mb-0 rounded-3"><i class="fas fa-check-circle me-1"></i>Sampel 16 digit dimuat (Standar Baru PMK 112 / OSS NIK). Klik "Verifikasi Legalitas" untuk menguji.</div>`;
            }
        });
    }

    if (btnVerifySellerKyc) {
        btnVerifySellerKyc.addEventListener('click', function () {
            const isNibValid = validateIdFormat(kycNibInput, kycNibValidationFeedback, kycNibCounterBadge, 'NIB');
            const isNpwpValid = validateIdFormat(kycNpwpInput, kycNpwpValidationFeedback, kycNpwpCounterBadge, 'NPWP');

            if (!isNibValid || !isNpwpValid) {
                if (kycAlertPlaceholder) {
                    kycAlertPlaceholder.innerHTML = `<div class="alert alert-danger py-2 small mb-0 rounded-3"><i class="fas fa-times-circle me-1"></i>Verifikasi ditolak. Pastikan NIB dan NPWP keduanya memenuhi format 15 digit atau 16 digit.</div>`;
                }
                return;
            }

            const nibVal = kycNibInput.value.replace(/\D/g, '');
            const npwpVal = kycNpwpInput.value.replace(/\D/g, '');

            if (profileNibDisplay) profileNibDisplay.textContent = nibVal;
            if (profileNpwpDisplay) profileNpwpDisplay.textContent = npwpVal;
            if (profileNibBadge) profileNibBadge.textContent = `${nibVal.length} Digit Valid`;
            if (profileNpwpBadge) profileNpwpBadge.textContent = `${npwpVal.length} Digit Valid`;

            if (sellerProfileVerifiedBadge) {
                sellerProfileVerifiedBadge.innerHTML = `<i class="fas fa-check-circle"></i> Verified in Sandbox`;
                sellerProfileVerifiedBadge.classList.add('animate__animated', 'animate__pulse');
            }

            if (kycAlertPlaceholder) {
                kycAlertPlaceholder.innerHTML = `
                    <div class="alert alert-success py-2 small mb-0 rounded-3 animate__animated animate__fadeIn">
                        <i class="fas fa-check-double me-1"></i><strong>Verifikasi Berhasil!</strong> Entitas Seller berstatus <strong>"Verified in Sandbox"</strong> (NIB ${nibVal.length} digit & NPWP ${npwpVal.length} digit valid).
                    </div>
                `;
            }
        });
    }

    // --------------------------------------------------------------------------
    // C. RFQ STEPPER ENGINE & AUTO-DOCUMENT GENERATOR (Sub-bab 2.4 & 3.2)
    // --------------------------------------------------------------------------
    const paneRfqStep1 = document.getElementById('paneRfqStep1');
    const paneRfqStep2 = document.getElementById('paneRfqStep2');
    const paneRfqStep3 = document.getElementById('paneRfqStep3');
    const rfqIndicatorStep1 = document.getElementById('rfqIndicatorStep1');
    const rfqIndicatorStep2 = document.getElementById('rfqIndicatorStep2');
    const rfqIndicatorStep3 = document.getElementById('rfqIndicatorStep3');
    const btnToStep2 = document.getElementById('btnToStep2');
    const btnToStep3 = document.getElementById('btnToStep3');
    const btnBackToStep1 = document.getElementById('btnBackToStep1');
    const btnBackToStep2 = document.getElementById('btnBackToStep2');
    const step1SubtotalDisplay = document.getElementById('step1SubtotalDisplay');
    const step1FormulaQty = document.getElementById('step1FormulaQty');
    const step1FormulaPrice = document.getElementById('step1FormulaPrice');

    function switchRfqStep(step) {
        if (paneRfqStep1) paneRfqStep1.style.display = (step === 1) ? 'block' : 'none';
        if (paneRfqStep2) paneRfqStep2.style.display = (step === 2) ? 'block' : 'none';
        if (paneRfqStep3) paneRfqStep3.style.display = (step === 3) ? 'block' : 'none';

        if (rfqIndicatorStep1) {
            rfqIndicatorStep1.className = 'rfq-step-indicator ' + (step === 1 ? 'active' : (step > 1 ? 'completed' : ''));
        }
        if (rfqIndicatorStep2) {
            rfqIndicatorStep2.className = 'rfq-step-indicator ' + (step === 2 ? 'active' : (step > 2 ? 'completed' : ''));
        }
        if (rfqIndicatorStep3) {
            rfqIndicatorStep3.className = 'rfq-step-indicator ' + (step === 3 ? 'active' : '');
        }

        if (step === 3) {
            renderRfqStep3Summary();
        }
    }

    window.handleStepNav = switchRfqStep;

    if (btnToStep2) btnToStep2.addEventListener('click', () => switchRfqStep(2));
    if (btnToStep3) btnToStep3.addEventListener('click', () => switchRfqStep(3));
    if (btnBackToStep1) btnBackToStep1.addEventListener('click', () => switchRfqStep(1));
    if (btnBackToStep2) btnBackToStep2.addEventListener('click', () => switchRfqStep(2));

    if (rfqIndicatorStep1) rfqIndicatorStep1.addEventListener('click', () => switchRfqStep(1));
    if (rfqIndicatorStep2) rfqIndicatorStep2.addEventListener('click', () => switchRfqStep(2));
    if (rfqIndicatorStep3) rfqIndicatorStep3.addEventListener('click', () => switchRfqStep(3));

    function updateRfqStep1Calculation() {
        const qty = parseFloat(step1QuantityInput ? step1QuantityInput.value : 5000) || 0;
        const price = parseFloat(step1TargetPriceInput ? step1TargetPriceInput.value : 12.5) || 0;
        const subtotal = qty * price;

        if (step1SubtotalDisplay) step1SubtotalDisplay.textContent = '$' + subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
        if (step1FormulaQty) step1FormulaQty.textContent = qty.toLocaleString();
        if (step1FormulaPrice) step1FormulaPrice.textContent = '$' + price.toFixed(2);

        // Also update sheet live preview
        updateOfficialDocumentSheet(qty, price, subtotal);
    }

    if (step1QuantityInput) step1QuantityInput.addEventListener('input', updateRfqStep1Calculation);
    if (step1TargetPriceInput) step1TargetPriceInput.addEventListener('input', updateRfqStep1Calculation);
    if (step1CommoditySelect) step1CommoditySelect.addEventListener('change', updateRfqStep1Calculation);

    function updateIncotermResponsibilityMatrix() {
        const incoterm = step2IncotermSelect ? step2IncotermSelect.value : 'FOB';
        const freightSpan = document.getElementById('incotermFreightSpan');
        const insuranceSpan = document.getElementById('incotermInsuranceSpan');
        const riskSpan = document.getElementById('incotermRiskSpan');

        if (incoterm === 'FOB') {
            if (freightSpan) freightSpan.textContent = 'Ditanggung Buyer';
            if (insuranceSpan) insuranceSpan.textContent = 'Ditanggung Buyer';
            if (riskSpan) riskSpan.textContent = 'Beralih saat barang melintasi rail kapal di POL';
        } else if (incoterm === 'CIF') {
            if (freightSpan) freightSpan.textContent = 'Ditanggung Eksportir (s/d Pelabuhan Tujuan)';
            if (insuranceSpan) insuranceSpan.textContent = 'Ditanggung Eksportir (Klausul ICC Marine)';
            if (riskSpan) riskSpan.textContent = 'Beralih saat barang naik ke kapal muat POL';
        } else if (incoterm === 'CFR') {
            if (freightSpan) freightSpan.textContent = 'Ditanggung Eksportir (s/d Pelabuhan Tujuan)';
            if (insuranceSpan) insuranceSpan.textContent = 'Ditanggung Buyer';
            if (riskSpan) riskSpan.textContent = 'Beralih saat barang naik ke kapal muat POL';
        }

        updateRfqStep1Calculation();
    }

    if (step2IncotermSelect) step2IncotermSelect.addEventListener('change', updateIncotermResponsibilityMatrix);
    if (step2PolInput) step2PolInput.addEventListener('input', updateRfqStep1Calculation);
    if (step2PodInput) step2PodInput.addEventListener('input', updateRfqStep1Calculation);

    function renderRfqStep3Summary() {
        const comm = step1CommoditySelect ? step1CommoditySelect.value : 'Artisan Cocoa Butter';
        const qty = parseFloat(step1QuantityInput ? step1QuantityInput.value : 5000) || 0;
        const price = parseFloat(step1TargetPriceInput ? step1TargetPriceInput.value : 12.5) || 0;
        const total = qty * price;
        const incoterm = step2IncotermSelect ? step2IncotermSelect.value : 'FOB';
        const pol = step2PolInput ? step2PolInput.value : 'Port of Tanjung Priok';
        const pod = step2PodInput ? step2PodInput.value : 'Port of Hamburg';

        const summaryCommodity = document.getElementById('summaryCommodity');
        const summaryIncoterm = document.getElementById('summaryIncoterm');
        const summaryQty = document.getElementById('summaryQty');
        const summaryPrice = document.getElementById('summaryPrice');
        const summaryPOL = document.getElementById('summaryPOL');
        const summaryPOD = document.getElementById('summaryPOD');
        const summaryTotal = document.getElementById('summaryTotal');

        if (summaryCommodity) summaryCommodity.textContent = comm;
        if (summaryIncoterm) summaryIncoterm.textContent = `${incoterm} (${pol})`;
        if (summaryQty) summaryQty.textContent = qty.toLocaleString() + ' Units / Kg';
        if (summaryPrice) summaryPrice.textContent = '$' + price.toFixed(2) + ' USD / Unit';
        if (summaryPOL) summaryPOL.textContent = pol;
        if (summaryPOD) summaryPOD.textContent = pod;
        if (summaryTotal) summaryTotal.textContent = '$' + total.toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' USD';

        // Update Escrow simulation total amount in Sync
        updateEscrowVaultTotal(total);
    }

    function updateOfficialDocumentSheet(qty, price, total) {
        const comm = step1CommoditySelect ? step1CommoditySelect.value : 'Artisan Pure Java Cocoa Butter & Shea Butter';
        const incoterm = step2IncotermSelect ? step2IncotermSelect.value : 'FOB';
        const pol = step2PolInput ? step2PolInput.value : 'Port of Tanjung Priok (IDTPP)';
        const pod = step2PodInput ? step2PodInput.value : 'Port of Hamburg, Germany (DEHAM)';

        const sheetCommodityName = document.getElementById('docSheetItemName');
        const sheetQty = document.getElementById('docSheetItemQty');
        const sheetPrice = document.getElementById('docSheetItemPrice');
        const sheetTotal = document.getElementById('docSheetItemTotal');
        const sheetGrandTotal = document.getElementById('docSheetGrandTotal');
        const sheetTradeTerms = document.getElementById('docSheetTradeTerms');
        const sheetPOL = document.getElementById('docSheetPOL');
        const sheetPOD = document.getElementById('docSheetPOD');

        if (sheetCommodityName) sheetCommodityName.textContent = comm;
        if (sheetQty) sheetQty.textContent = qty.toLocaleString() + ' Units';
        if (sheetPrice) sheetPrice.textContent = '$' + price.toFixed(2) + ' USD';
        if (sheetTotal) sheetTotal.textContent = '$' + total.toLocaleString(undefined, { minimumFractionDigits: 2 });
        if (sheetGrandTotal) sheetGrandTotal.textContent = '$' + total.toLocaleString(undefined, { minimumFractionDigits: 2 }) + ' USD';
        if (sheetTradeTerms) sheetTradeTerms.textContent = `${incoterm} ${pol} (Incoterms 2020)`;
        if (sheetPOL) sheetPOL.textContent = pol;
        if (sheetPOD) sheetPOD.textContent = pod;
    }

    // Submit RFQ Action
    const btnExecuteSubmitRfq = document.getElementById('btnExecuteSubmitRfq');
    const rfqApprovedActionBox = document.getElementById('rfqApprovedActionBox');
    const btnDownloadProformaInvoice = document.getElementById('btnDownloadProformaInvoice');
    const btnDownloadSalesContract = document.getElementById('btnDownloadSalesContract');

    if (btnExecuteSubmitRfq) {
        btnExecuteSubmitRfq.addEventListener('click', function () {
            if (rfqApprovedActionBox) {
                rfqApprovedActionBox.style.display = 'block';
                rfqApprovedActionBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Download Draft Proforma Invoice (PDF)
    if (btnDownloadProformaInvoice) {
        btnDownloadProformaInvoice.addEventListener('click', function () {
            const sheetTitle = document.getElementById('docSheetHeaderTitle');
            if (sheetTitle) sheetTitle.textContent = 'PROFORMA INVOICE';
            triggerPdfDownload('Draft-Proforma-Invoice-NusaBridge.pdf');
        });
    }

    // Download Draft Sales Contract (PDF)
    if (btnDownloadSalesContract) {
        btnDownloadSalesContract.addEventListener('click', function () {
            const sheetTitle = document.getElementById('docSheetHeaderTitle');
            if (sheetTitle) sheetTitle.textContent = 'EXPORT SALES CONTRACT';
            triggerPdfDownload('Draft-Sales-Contract-NusaBridge.pdf');
        });
    }

    function triggerPdfDownload(fileName) {
        const element = document.getElementById('rfqPrintDocumentArea');
        if (!element) return;

        if (window.html2pdf) {
            const opt = {
                margin: 0.4,
                filename: fileName,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        } else {
            // High fidelity print fallback
            window.print();
        }
    }

    // Initial calculations
    updateRfqStep1Calculation();
    updateIncotermResponsibilityMatrix();

    // --------------------------------------------------------------------------
    // D. DASHBOARD TRACKING TRANSAKSI & SIMULASI ESCROW (Sub-bab 3.2 & 4.1)
    // - Status: Escrow Simulation: 100% Locked
    // - 4 Milestone Indicators:
    //   1. Upload Document QC (COA) -> Release 30%
    //   2. Upload NPE Jalur Hijau -> Release 30%
    //   3. Upload Bill of Lading (B/L) -> Release 20%
    //   4. Konfirmasi Penerimaan Buyer -> Release 20% (Status Finished)
    // --------------------------------------------------------------------------
    let escrowVaultTotal = 62500;
    let releasedMilestonePercent = 0;

    const escrowLiveTotalDisplay = document.getElementById('escrowLiveTotalDisplay');
    const escrowLiveReleasedDisplay = document.getElementById('escrowLiveReleasedDisplay');
    const escrowMilestonePhaseBadge = document.getElementById('escrowMilestonePhaseBadge');
    const escrowProgressTextValue = document.getElementById('escrowProgressTextValue');
    const escrowInteractiveBar = document.getElementById('escrowInteractiveBar');

    const btnActionMilestone1 = document.getElementById('btnActionMilestone1');
    const btnActionMilestone2 = document.getElementById('btnActionMilestone2');
    const btnActionMilestone3 = document.getElementById('btnActionMilestone3');
    const btnActionMilestone4 = document.getElementById('btnActionMilestone4');

    const escrowMilestoneBox1 = document.getElementById('escrowMilestoneBox1');
    const escrowMilestoneBox2 = document.getElementById('escrowMilestoneBox2');
    const escrowMilestoneBox3 = document.getElementById('escrowMilestoneBox3');
    const escrowMilestoneBox4 = document.getElementById('escrowMilestoneBox4');

    const milestoneStateBadge1 = document.getElementById('milestoneStateBadge1');
    const milestoneStateBadge2 = document.getElementById('milestoneStateBadge2');
    const milestoneStateBadge3 = document.getElementById('milestoneStateBadge3');
    const milestoneStateBadge4 = document.getElementById('milestoneStateBadge4');

    const btnRunFullEscrowDemo = document.getElementById('btnRunFullEscrowDemo');
    const btnResetEscrowDemo = document.getElementById('btnResetEscrowDemo');

    function updateEscrowVaultTotal(newTotal) {
        if (newTotal && newTotal > 0) {
            escrowVaultTotal = newTotal;
            if (escrowLiveTotalDisplay) {
                escrowLiveTotalDisplay.textContent = '$' + escrowVaultTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' USD';
            }
            refreshEscrowUiDisplay();
        }
    }

    function refreshEscrowUiDisplay() {
        const releasedAmount = (escrowVaultTotal * releasedMilestonePercent) / 100;
        if (escrowLiveReleasedDisplay) {
            escrowLiveReleasedDisplay.textContent = `$${releasedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD (${releasedMilestonePercent}% Dicairkan)`;
        }
        if (escrowProgressTextValue) {
            if (releasedMilestonePercent === 100) {
                escrowProgressTextValue.textContent = `100% Selesai (Dana Lunas Diterima Eksportir - Status Finished)`;
            } else {
                escrowProgressTextValue.textContent = `${releasedMilestonePercent}% / 100% (${100 - releasedMilestonePercent}% Masih Terkunci di Vault)`;
            }
        }
        if (escrowInteractiveBar) {
            escrowInteractiveBar.style.width = `${releasedMilestonePercent}%`;
            if (releasedMilestonePercent === 100) {
                escrowInteractiveBar.classList.remove('progress-bar-animated');
                escrowInteractiveBar.classList.add('bg-success');
            } else {
                escrowInteractiveBar.classList.add('progress-bar-animated');
            }
        }

        // Update amounts on each card
        const amt1 = escrowVaultTotal * 0.3;
        const amt2 = escrowVaultTotal * 0.3;
        const amt3 = escrowVaultTotal * 0.2;
        const amt4 = escrowVaultTotal * 0.2;

        const mAmount1 = document.getElementById('milestoneAmount1');
        const mAmount2 = document.getElementById('milestoneAmount2');
        const mAmount3 = document.getElementById('milestoneAmount3');
        const mAmount4 = document.getElementById('milestoneAmount4');

        if (mAmount1) mAmount1.textContent = `($${amt1.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD)`;
        if (mAmount2) mAmount2.textContent = `($${amt2.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD)`;
        if (mAmount3) mAmount3.textContent = `($${amt3.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD)`;
        if (mAmount4) mAmount4.textContent = `($${amt4.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD)`;
    }

    function triggerMilestoneStep(step) {
        if (step === 1) {
            releasedMilestonePercent = 30;
            if (escrowMilestoneBox1) {
                escrowMilestoneBox1.className = 'escrow-milestone-card released';
            }
            if (milestoneStateBadge1) {
                milestoneStateBadge1.className = 'badge bg-success text-white';
                milestoneStateBadge1.textContent = '30% Released';
            }
            if (btnActionMilestone1) {
                btnActionMilestone1.disabled = true;
                btnActionMilestone1.className = 'btn btn-sm btn-success rounded-pill w-100 fw-bold';
                btnActionMilestone1.innerHTML = '<i class="fas fa-check me-1"></i>QC COA Diverifikasi';
            }
            if (escrowMilestoneBox2) escrowMilestoneBox2.classList.add('current');
            if (btnActionMilestone2) {
                btnActionMilestone2.disabled = false;
                btnActionMilestone2.className = 'btn btn-sm btn-primary rounded-pill w-100 fw-bold';
            }
            if (escrowMilestonePhaseBadge) {
                escrowMilestonePhaseBadge.className = 'badge bg-info text-dark fw-bold px-3 py-1';
                escrowMilestonePhaseBadge.textContent = 'Fase 2: Menunggu NPE Jalur Hijau';
            }
        } else if (step === 2) {
            releasedMilestonePercent = 60;
            if (escrowMilestoneBox2) {
                escrowMilestoneBox2.className = 'escrow-milestone-card released';
            }
            if (milestoneStateBadge2) {
                milestoneStateBadge2.className = 'badge bg-success text-white';
                milestoneStateBadge2.textContent = '30% Released';
            }
            if (btnActionMilestone2) {
                btnActionMilestone2.disabled = true;
                btnActionMilestone2.className = 'btn btn-sm btn-success rounded-pill w-100 fw-bold';
                btnActionMilestone2.innerHTML = '<i class="fas fa-check me-1"></i>NPE Jalur Hijau Selesai';
            }
            if (escrowMilestoneBox3) escrowMilestoneBox3.classList.add('current');
            if (btnActionMilestone3) {
                btnActionMilestone3.disabled = false;
                btnActionMilestone3.className = 'btn btn-sm btn-primary rounded-pill w-100 fw-bold';
            }
            if (escrowMilestonePhaseBadge) {
                escrowMilestonePhaseBadge.className = 'badge bg-primary text-white fw-bold px-3 py-1';
                escrowMilestonePhaseBadge.textContent = 'Fase 3: Menunggu On-Board Bill of Lading';
            }
        } else if (step === 3) {
            releasedMilestonePercent = 80;
            if (escrowMilestoneBox3) {
                escrowMilestoneBox3.className = 'escrow-milestone-card released';
            }
            if (milestoneStateBadge3) {
                milestoneStateBadge3.className = 'badge bg-success text-white';
                milestoneStateBadge3.textContent = '20% Released';
            }
            if (btnActionMilestone3) {
                btnActionMilestone3.disabled = true;
                btnActionMilestone3.className = 'btn btn-sm btn-success rounded-pill w-100 fw-bold';
                btnActionMilestone3.innerHTML = '<i class="fas fa-check me-1"></i>On-Board B/L Terbit';
            }
            if (escrowMilestoneBox4) escrowMilestoneBox4.classList.add('current');
            if (btnActionMilestone4) {
                btnActionMilestone4.disabled = false;
                btnActionMilestone4.className = 'btn btn-sm btn-primary rounded-pill w-100 fw-bold';
            }
            if (escrowMilestonePhaseBadge) {
                escrowMilestonePhaseBadge.className = 'badge bg-warning text-dark fw-bold px-3 py-1';
                escrowMilestonePhaseBadge.textContent = 'Fase 4: Menunggu Konfirmasi Penerimaan Buyer';
            }
        } else if (step === 4) {
            releasedMilestonePercent = 100;
            if (escrowMilestoneBox4) {
                escrowMilestoneBox4.className = 'escrow-milestone-card released';
            }
            if (milestoneStateBadge4) {
                milestoneStateBadge4.className = 'badge bg-success text-white';
                milestoneStateBadge4.textContent = '20% Released (Finished)';
            }
            if (btnActionMilestone4) {
                btnActionMilestone4.disabled = true;
                btnActionMilestone4.className = 'btn btn-sm btn-success rounded-pill w-100 fw-bold';
                btnActionMilestone4.innerHTML = '<i class="fas fa-check-double me-1"></i>Penerimaan Selesai';
            }
            if (escrowMilestonePhaseBadge) {
                escrowMilestonePhaseBadge.className = 'badge bg-success text-white fw-bold px-3 py-1';
                escrowMilestonePhaseBadge.textContent = 'Status Finished: Dana 100% Sukses Dicairkan';
            }
            // Update logistics timeline to delivered
            const finishedStep = document.getElementById('logisticsFinishedTimelineStep');
            if (finishedStep) {
                finishedStep.className = 'timeline-milestone done';
                finishedStep.querySelector('.timeline-dot').innerHTML = '<i class="fas fa-check"></i>';
            }
        }
        refreshEscrowUiDisplay();
    }

    if (btnActionMilestone1) btnActionMilestone1.addEventListener('click', () => triggerMilestoneStep(1));
    if (btnActionMilestone2) btnActionMilestone2.addEventListener('click', () => triggerMilestoneStep(2));
    if (btnActionMilestone3) btnActionMilestone3.addEventListener('click', () => triggerMilestoneStep(3));
    if (btnActionMilestone4) btnActionMilestone4.addEventListener('click', () => triggerMilestoneStep(4));

    if (btnRunFullEscrowDemo) {
        btnRunFullEscrowDemo.addEventListener('click', function () {
            triggerMilestoneStep(1);
            setTimeout(() => triggerMilestoneStep(2), 600);
            setTimeout(() => triggerMilestoneStep(3), 1200);
            setTimeout(() => triggerMilestoneStep(4), 1800);
        });
    }

    if (btnResetEscrowDemo) {
        btnResetEscrowDemo.addEventListener('click', function () {
            releasedMilestonePercent = 0;
            [escrowMilestoneBox1, escrowMilestoneBox2, escrowMilestoneBox3, escrowMilestoneBox4].forEach(b => {
                if (b) b.className = 'escrow-milestone-card';
            });
            if (escrowMilestoneBox1) escrowMilestoneBox1.classList.add('current');

            if (milestoneStateBadge1) { milestoneStateBadge1.className = 'badge bg-primary text-white'; milestoneStateBadge1.textContent = 'Aktif'; }
            if (milestoneStateBadge2) { milestoneStateBadge2.className = 'badge bg-secondary text-white'; milestoneStateBadge2.textContent = 'Pending'; }
            if (milestoneStateBadge3) { milestoneStateBadge3.className = 'badge bg-secondary text-white'; milestoneStateBadge3.textContent = 'Pending'; }
            if (milestoneStateBadge4) { milestoneStateBadge4.className = 'badge bg-secondary text-white'; milestoneStateBadge4.textContent = 'Pending'; }

            if (btnActionMilestone1) {
                btnActionMilestone1.disabled = false;
                btnActionMilestone1.className = 'btn btn-sm btn-primary rounded-pill w-100 fw-bold';
                btnActionMilestone1.innerHTML = '<i class="fas fa-file-upload me-1"></i>Upload Document QC (COA)';
            }
            if (btnActionMilestone2) {
                btnActionMilestone2.disabled = true;
                btnActionMilestone2.className = 'btn btn-sm btn-outline-secondary rounded-pill w-100 fw-bold';
                btnActionMilestone2.innerHTML = '<i class="fas fa-stamp me-1"></i>Upload NPE Jalur Hijau';
            }
            if (btnActionMilestone3) {
                btnActionMilestone3.disabled = true;
                btnActionMilestone3.className = 'btn btn-sm btn-outline-secondary rounded-pill w-100 fw-bold';
                btnActionMilestone3.innerHTML = '<i class="fas fa-ship me-1"></i>Upload Bill of Lading (B/L)';
            }
            if (btnActionMilestone4) {
                btnActionMilestone4.disabled = true;
                btnActionMilestone4.className = 'btn btn-sm btn-outline-secondary rounded-pill w-100 fw-bold';
                btnActionMilestone4.innerHTML = '<i class="fas fa-handshake me-1"></i>Konfirmasi Buyer';
            }

            if (escrowMilestonePhaseBadge) {
                escrowMilestonePhaseBadge.className = 'badge bg-warning text-dark fw-bold px-3 py-1';
                escrowMilestonePhaseBadge.textContent = 'Fase 1: Menunggu Dokumen QC (COA)';
            }

            const finishedStep = document.getElementById('logisticsFinishedTimelineStep');
            if (finishedStep) {
                finishedStep.className = 'timeline-milestone';
                finishedStep.querySelector('.timeline-dot').innerHTML = '<i class="fas fa-map-pin"></i>';
            }

            refreshEscrowUiDisplay();
        });
    }

    refreshEscrowUiDisplay();

    // --------------------------------------------------------------------------
    // E. LOGISTICS TRACKING SUB-SECTION
    // --------------------------------------------------------------------------
    const btnRunLogisticsTracking = document.getElementById('btnRunLogisticsTracking');
    const inputLogisticsNumber = document.getElementById('inputLogisticsNumber');
    const btnSampleTrackBL = document.getElementById('btnSampleTrackBL');
    const btnSampleTrackPEB = document.getElementById('btnSampleTrackPEB');
    const logisticsTypePill = document.getElementById('logisticsTypePill');
    const logisticsNumberText = document.getElementById('logisticsNumberText');
    const logisticsShipperText = document.getElementById('logisticsShipperText');
    const logisticsCarrierText = document.getElementById('logisticsCarrierText');
    const logisticsRouteText = document.getElementById('logisticsRouteText');
    const logisticsStatusPill = document.getElementById('logisticsStatusPill');

    if (btnSampleTrackBL) {
        btnSampleTrackBL.addEventListener('click', function () {
            if (inputLogisticsNumber) inputLogisticsNumber.value = 'BL-IDN-2026-8890';
            updateLogisticsDisplay('BL-IDN-2026-8890', 'Bill of Lading (B/L)', 'PT Nusa Java Organik', 'MV Nusantara Pride Voy 104N', 'Tanjung Priok -> Port of Hamburg', 'Dalam Pelayaran Samudera (In-Transit)');
        });
    }

    if (btnSampleTrackPEB) {
        btnSampleTrackPEB.addEventListener('click', function () {
            if (inputLogisticsNumber) inputLogisticsNumber.value = 'PEB-040300-2026-004123';
            updateLogisticsDisplay('PEB-040300-2026-004123', 'Pemberitahuan Ekspor Barang (PEB)', 'PT Nusa Java Organik', 'KPU Bea Cukai Tanjung Priok', 'Jakarta -> Hamburg Port', 'Jalur Hijau (NPE Diterbitkan)');
        });
    }

    if (btnRunLogisticsTracking) {
        btnRunLogisticsTracking.addEventListener('click', function () {
            const val = inputLogisticsNumber ? inputLogisticsNumber.value.trim() : '';
            if (!val) {
                alert('Silakan masukkan nomor B/L atau PEB terlebih dahulu.');
                return;
            }
            const isPeb = val.toUpperCase().startsWith('PEB');
            updateLogisticsDisplay(
                val,
                isPeb ? 'Pemberitahuan Ekspor Barang (PEB)' : 'Bill of Lading (B/L)',
                'PT Nusa Java Organik',
                'MV Nusantara Pride Voy 104N',
                'Tanjung Priok -> Port of Hamburg',
                isPeb ? 'Jalur Hijau Terverifikasi' : 'Dalam Pelayaran Samudera (In-Transit)'
            );
        });
    }

    function updateLogisticsDisplay(num, type, shipper, carrier, route, status) {
        if (logisticsNumberText) logisticsNumberText.textContent = num;
        if (logisticsTypePill) logisticsTypePill.textContent = type;
        if (logisticsShipperText) logisticsShipperText.textContent = shipper;
        if (logisticsCarrierText) logisticsCarrierText.textContent = carrier;
        if (logisticsRouteText) logisticsRouteText.textContent = route;
        if (logisticsStatusPill) logisticsStatusPill.textContent = status;
    }

});
