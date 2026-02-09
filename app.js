// Stock Profit Calculator - ER1991
// © ER1991 2026
// Version 2.0 - Modern UI + Bilingual + Smart Commission Total

class StockCalculator {
    constructor() {
        this.currentLang = 'ar';
        this.initElements();
        this.initTranslations();
        this.bindEvents();
        this.calculationData = null;
        this.initApp();
    }

    // الترجمات
    initTranslations() {
        this.translations = {
            ar: {
                appName: 'Stock Profit Calculator',
                appNameShort: 'Stock Calc',
                calculatorTitle: 'حاسبة الأرباح والخسائر',
                stockName: 'اسم السهم',
                sharesCount: 'عدد الأسهم',
                purchaseDetails: 'تفاصيل الشراء',
                pricePerShare: 'سعر السهم',
                totalAmount: 'الإجمالي',
                totalWithCommission: 'الإجمالي بالعمولة',
                smart: 'ذكي',
                currentPrice: 'السعر الحالي',
                commission: 'العمولة',
                commissionPercent: 'نسبة %',
                commissionAmount: 'مبلغ ثابت',
                calculate: 'حساب النتيجة',
                result: 'النتيجة',
                download: 'تحميل الصورة',
                newCalc: 'حساب جديد',
                profit: 'ربح',
                loss: 'خسارة',
                purchaseSummary: 'ملخص الشراء',
                quantity: 'الكمية',
                currentValue: 'القيمة الحالية',
                totalSelling: 'إجمالي البيع الصافي',
                date: 'التاريخ',
                time: 'الوقت'
            },
            en: {
                appName: 'Stock Profit Calculator',
                appNameShort: 'Stock Calc',
                calculatorTitle: 'Profit & Loss Calculator',
                stockName: 'Stock Name',
                sharesCount: 'Number of Shares',
                purchaseDetails: 'Purchase Details',
                pricePerShare: 'Price per Share',
                totalAmount: 'Total Amount',
                totalWithCommission: 'Total with Commission',
                smart: 'SMART',
                currentPrice: 'Current Price',
                commission: 'Commission',
                commissionPercent: 'Percentage %',
                commissionAmount: 'Fixed Amount',
                calculate: 'Calculate Result',
                result: 'Result',
                download: 'Download Image',
                newCalc: 'New Calculation',
                profit: 'Profit',
                loss: 'Loss',
                purchaseSummary: 'Purchase Summary',
                quantity: 'Quantity',
                currentValue: 'Current Value',
                totalSelling: 'Net Selling Amount',
                date: 'Date',
                time: 'Time'
            }
        };
    }

    initElements() {
        this.splashScreen = document.getElementById('splash-screen');
        this.mainApp = document.getElementById('main-app');
        this.resultScreen = document.getElementById('result-screen');
        this.langToggle = document.getElementById('lang-toggle');

        // Form elements
        this.form = document.getElementById('stock-form');
        this.stockName = document.getElementById('stock-name');
        this.sharesCount = document.getElementById('shares-count');
        this.purchasePricePerShare = document.getElementById('purchase-price-per-share');
        this.totalPurchasePrice = document.getElementById('total-purchase-price');
        this.totalWithCommission = document.getElementById('total-with-commission');
        this.currentPrice = document.getElementById('current-price');
        this.commissionPercent = document.getElementById('commission-percent');
        this.commissionAmount = document.getElementById('commission-amount');

        // Buttons
        this.backBtn = document.getElementById('back-btn');
        this.downloadBtn = document.getElementById('download-btn');
        this.newCalcBtn = document.getElementById('new-calc-btn');

        // Canvas
        this.canvas = document.getElementById('receipt-canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    bindEvents() {
        // Language toggle
        this.langToggle.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                const lang = e.target.dataset.lang;
                if (lang !== this.currentLang) {
                    this.switchLanguage(lang);
                }
            }
        });

        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculate();
        });

        // Smart calculations
        this.setupSmartCalculations();

        // Navigation
        this.backBtn.addEventListener('click', () => this.showMainApp());
        this.newCalcBtn.addEventListener('click', () => this.showMainApp());
        this.downloadBtn.addEventListener('click', () => this.downloadReceipt());
    }

    setupSmartCalculations() {
        const shares = this.sharesCount;
        const pricePerShare = this.purchasePricePerShare;
        const totalPrice = this.totalPurchasePrice;
        const totalWithComm = this.totalWithCommission;
        const commPercent = this.commissionPercent;
        const commAmount = this.commissionAmount;

        // من سعر السهم للإجمالي
        pricePerShare.addEventListener('input', () => {
            if (pricePerShare.value && shares.value) {
                const total = parseFloat(pricePerShare.value) * parseInt(shares.value);
                totalPrice.value = total.toFixed(2);
                this.updateTotalWithCommission();
            }
        });

        // من الإجمالي لسعر السهم
        totalPrice.addEventListener('input', () => {
            if (totalPrice.value && shares.value) {
                const perShare = parseFloat(totalPrice.value) / parseInt(shares.value);
                pricePerShare.value = perShare.toFixed(2);
                this.updateTotalWithCommission();
            }
        });

        // من الإجمالي بالعمولة للعمولة
        totalWithComm.addEventListener('input', () => {
            if (totalWithComm.value && totalPrice.value) {
                const commission = parseFloat(totalWithComm.value) - parseFloat(totalPrice.value);
                if (commission >= 0) {
                    commAmount.value = commission.toFixed(2);
                    commPercent.value = '';
                }
            }
        });

        // تحديث الإجمالي بالعمولة عند تغيير عدد الأسهم
        shares.addEventListener('input', () => {
            if (pricePerShare.value) {
                const total = parseFloat(pricePerShare.value) * parseInt(shares.value || 0);
                totalPrice.value = total.toFixed(2);
            } else if (totalPrice.value) {
                const perShare = parseFloat(totalPrice.value) / parseInt(shares.value || 1);
                pricePerShare.value = perShare.toFixed(2);
            }
            this.updateTotalWithCommission();
        });

        // العمولة نسبة أو مبلغ
        commPercent.addEventListener('input', () => {
            if (commPercent.value) {
                commAmount.value = '';
                this.updateTotalWithCommission();
            }
        });

        commAmount.addEventListener('input', () => {
            if (commAmount.value) {
                commPercent.value = '';
                this.updateTotalWithCommission();
            }
        });
    }

    updateTotalWithCommission() {
        const total = parseFloat(this.totalPurchasePrice.value) || 0;
        const shares = parseInt(this.sharesCount.value) || 0;
        const current = parseFloat(this.currentPrice.value) || 0;
        const commPercent = parseFloat(this.commissionPercent.value) || 0;
        const commAmount = parseFloat(this.commissionAmount.value) || 0;

        let commission = 0;
        const currentValue = current * shares;

        if (commPercent > 0) {
            commission = (currentValue * commPercent) / 100;
        } else if (commAmount > 0) {
            commission = commAmount;
        }

        const totalWithComm = total + commission;
        if (total > 0 && commission > 0) {
            this.totalWithCommission.value = totalWithComm.toFixed(2);
        }
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        document.documentElement.lang = lang;
        document.body.dir = lang === 'ar' ? 'rtl' : 'ltr';

        // Update buttons
        this.langToggle.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update all text elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.translations[lang][key]) {
                el.textContent = this.translations[lang][key];
            }
        });

        // Update placeholders
        this.updatePlaceholders();
    }

    updatePlaceholders() {
        const t = this.translations[this.currentLang];
        this.stockName.placeholder = this.currentLang === 'ar' ? 'مثال: Apple (AAPL)' : 'e.g., Apple (AAPL)';
    }

    initApp() {
        setTimeout(() => {
            this.splashScreen.classList.add('hide');
            this.mainApp.classList.add('show');
            setTimeout(() => {
                this.splashScreen.style.display = 'none';
            }, 600);
        }, 2500);
    }

    calculate() {
        const shares = parseInt(this.sharesCount.value);
        const purchasePrice = parseFloat(this.purchasePricePerShare.value) || 0;
        const current = parseFloat(this.currentPrice.value);
        const commPercent = parseFloat(this.commissionPercent.value) || 0;
        const commAmount = parseFloat(this.commissionAmount.value) || 0;

        if (!shares || !current) {
            alert(this.currentLang === 'ar' ? 'الرجاء إدخال جميع البيانات المطلوبة' : 'Please fill in all required fields');
            return;
        }

        const totalPurchase = purchasePrice * shares;
        const currentValue = current * shares;

        let commission = 0;
        if (commPercent > 0) {
            commission = (currentValue * commPercent) / 100;
        } else if (commAmount > 0) {
            commission = commAmount;
        }

        const totalWithCommission = totalPurchase + commission;
        const grossProfit = currentValue - totalPurchase;
        const netProfit = grossProfit - commission;
        const profitPercent = totalPurchase > 0 ? (netProfit / totalPurchase) * 100 : 0;
        const totalSelling = currentValue - commission;

        this.calculationData = {
            stockName: this.stockName.value || (this.currentLang === 'ar' ? 'غير معروف' : 'Unknown'),
            shares: shares,
            purchasePrice: purchasePrice,
            totalPurchase: totalPurchase,
            totalWithCommission: totalWithCommission,
            commission: commission,
            commissionPercent: commPercent,
            currentPrice: current,
            currentValue: currentValue,
            grossProfit: grossProfit,
            netProfit: netProfit,
            profitPercent: profitPercent,
            totalSelling: totalSelling,
            date: new Date().toLocaleDateString(this.currentLang === 'ar' ? 'ar-SA' : 'en-US'),
            time: new Date().toLocaleTimeString(this.currentLang === 'ar' ? 'ar-SA' : 'en-US'),
            lang: this.currentLang
        };

        this.generateReceipt();
        this.showResultScreen();
    }

    generateReceipt() {
        const ctx = this.ctx;
        const data = this.calculationData;
        const width = 600;
        const height = 850;
        const isAr = data.lang === 'ar';
        const t = this.translations[data.lang];

        // Clear
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        // Background gradient
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#0f172a');
        bgGradient.addColorStop(1, '#1e293b');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Decorative circles
        ctx.fillStyle = 'rgba(99, 102, 241, 0.1)';
        ctx.beginPath();
        ctx.arc(500, 100, 150, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(236, 72, 153, 0.08)';
        ctx.beginPath();
        ctx.arc(100, 300, 100, 0, Math.PI * 2);
        ctx.fill();

        // Header
        const headerGradient = ctx.createLinearGradient(0, 0, width, 180);
        headerGradient.addColorStop(0, '#6366f1');
        headerGradient.addColorStop(1, '#8b5cf6');
        ctx.fillStyle = headerGradient;
        ctx.fillRect(0, 0, width, 180);

        // Logo area
        ctx.fillStyle = 'white';
        ctx.font = 'bold 36px Tajawal, Inter, Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Stock Profit Calculator', width / 2, 70);

        ctx.font = '24px Tajawal, Inter, Arial';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillText('By ER1991', width / 2, 105);

        ctx.font = '16px Tajawal, Inter, Arial';
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('© ER1991 2026', width / 2, 140);

        // Content card
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.roundRect(30, 200, width - 60, height - 280, 20);
        ctx.fill();

        ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();

        let y = 240;

        // Stock Name
        ctx.fillStyle = '#818cf8';
        ctx.font = 'bold 28px Tajawal, Inter, Arial';
        ctx.textAlign = isAr ? 'right' : 'left';
        const nameX = isAr ? width - 50 : 50;
        ctx.fillText(data.stockName, nameX, y);

        ctx.fillStyle = '#64748b';
        ctx.font = '16px Tajawal, Inter, Arial';
        ctx.fillText(t.stockName, nameX, y + 25);

        y += 70;

        // Divider
        this.drawDivider(ctx, 50, y - 20, width - 100, 'rgba(99, 102, 241, 0.2)');

        // Purchase Details
        ctx.fillStyle = '#ec4899';
        ctx.font = 'bold 20px Tajawal, Inter, Arial';
        ctx.fillText(t.purchaseSummary, nameX, y);

        y += 40;

        // Shares and Price
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 22px Tajawal, Inter, Arial';
        ctx.textAlign = isAr ? 'left' : 'right';
        const valX = isAr ? 50 : width - 50;
        ctx.fillText(`${data.shares} ${t.quantity}`, valX, y);
        
        ctx.textAlign = isAr ? 'right' : 'left';
        ctx.fillText(`$${data.purchasePrice.toFixed(2)}`, nameX, y);

        ctx.fillStyle = '#64748b';
        ctx.font = '14px Tajawal, Inter, Arial';
        ctx.textAlign = isAr ? 'left' : 'right';
        ctx.fillText(t.sharesCount, valX, y + 20);
        ctx.textAlign = isAr ? 'right' : 'left';
        ctx.fillText(t.pricePerShare, nameX, y + 20);

        y += 60;

        // Total Purchase
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 26px Tajawal, Inter, Arial';
        ctx.textAlign = isAr ? 'right' : 'left';
        ctx.fillText(`$${data.totalPurchase.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, nameX, y);
        
        ctx.fillStyle = '#64748b';
        ctx.font = '14px Tajawal, Inter, Arial';
        ctx.fillText(t.totalAmount, nameX, y + 22);

        y += 50;

        // Total with Commission (NEW)
        if (data.commission > 0) {
            this.drawDivider(ctx, 50, y - 15, width - 100, 'rgba(245, 158, 11, 0.3)');
            
            ctx.fillStyle = '#f59e0b';
            ctx.font = 'bold 22px Tajawal, Inter, Arial';
            ctx.fillText(`$${data.totalWithCommission.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, nameX, y);
            
            ctx.fillStyle = '#fbbf24';
            ctx.font = '14px Tajawal, Inter, Arial';
            ctx.fillText(t.totalWithCommission, nameX, y + 22);

            y += 50;
        }

        this.drawDivider(ctx, 50, y - 15, width - 100, 'rgba(99, 102, 241, 0.2)');

        // Current Value
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 20px Tajawal, Inter, Arial';
        ctx.fillText(t.currentValue, nameX, y);

        y += 35;

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 24px Tajawal, Inter, Arial';
        ctx.textAlign = isAr ? 'left' : 'right';
        ctx.fillText(`$${data.currentPrice.toFixed(2)}`, valX, y);
        ctx.textAlign = isAr ? 'right' : 'left';
        ctx.fillText(`$${data.currentValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, nameX, y);

        ctx.fillStyle = '#64748b';
        ctx.font = '14px Tajawal, Inter, Arial';
        ctx.textAlign = isAr ? 'left' : 'right';
        ctx.fillText(t.currentPrice, valX, y + 20);
        ctx.textAlign = isAr ? 'right' : 'left';
        ctx.fillText(t.currentValue, nameX, y + 20);

        y += 60;

        // Commission if exists
        if (data.commission > 0) {
            this.drawDivider(ctx, 50, y - 15, width - 100, 'rgba(239, 68, 68, 0.3)');
            
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 20px Tajawal, Inter, Arial';
            ctx.textAlign = isAr ? 'right' : 'left';
            const commLabel = data.commissionPercent > 0 ? `${t.commission} (${data.commissionPercent}%)` : t.commission;
            ctx.fillText(`-$${data.commission.toFixed(2)}`, nameX, y);
            
            ctx.fillStyle = '#f87171';
            ctx.font = '14px Tajawal, Inter, Arial';
            ctx.fillText(commLabel, nameX, y + 20);

            y += 50;
        }

        // Result Box
        const isProfit = data.netProfit >= 0;
        const resultColor = isProfit ? '#10b981' : '#ef4444';
        const resultText = isProfit ? t.profit : t.loss;

        y += 20;

        // Result background with glow
        ctx.shadowColor = resultColor;
        ctx.shadowBlur = 30;
        ctx.fillStyle = resultColor + '20';
        ctx.roundRect(50, y, width - 100, 130, 15);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = resultColor;
        ctx.lineWidth = 3;
        ctx.stroke();

        y += 45;

        ctx.fillStyle = resultColor;
        ctx.font = 'bold 28px Tajawal, Inter, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(resultText, width / 2, y);

        y += 40;

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 40px Tajawal, Inter, Arial';
        const profitText = `${isProfit ? '+' : ''}$${Math.abs(data.netProfit).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        ctx.fillText(profitText, width / 2, y);

        y += 35;

        ctx.fillStyle = resultColor;
        ctx.font = 'bold 24px Tajawal, Inter, Arial';
        const percentText = `${isProfit ? '+' : ''}${data.profitPercent.toFixed(2)}%`;
        ctx.fillText(percentText, width / 2, y);

        y += 60;

        // Total Selling
        this.drawDivider(ctx, 50, y - 15, width - 100, 'rgba(255, 255, 255, 0.1)');

        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 18px Tajawal, Inter, Arial';
        ctx.fillText(t.totalSelling, width / 2, y);

        y += 35;

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 36px Tajawal, Inter, Arial';
        ctx.fillText(`$${data.totalSelling.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, width / 2, y);

        // Footer
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.fillRect(0, height - 60, width, 60);

        ctx.fillStyle = '#64748b';
        ctx.font = '14px Tajawal, Inter, Arial';
        ctx.fillText(`${data.date} | ${data.time}`, width / 2, height - 35);
        
        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 14px Tajawal, Inter, Arial';
        ctx.fillText('© ER1991 2026', width / 2, height - 15);
    }

    drawDivider(ctx, x, y, width, color = 'rgba(255,255,255,0.1)') {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    showResultScreen() {
        this.resultScreen.classList.remove('hidden');
        void this.resultScreen.offsetWidth;
        this.resultScreen.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    showMainApp() {
        this.resultScreen.classList.remove('show');
        setTimeout(() => {
            this.resultScreen.classList.add('hidden');
        }, 400);
        document.body.style.overflow = '';
        this.form.reset();
    }

    downloadReceipt() {
        const link = document.createElement('a');
        link.download = `transaction_receipt_ER1991_${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new StockCalculator();
});
