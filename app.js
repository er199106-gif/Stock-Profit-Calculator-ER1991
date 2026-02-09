// Stock Profit Calculator - ER1991
// © ER1991 2026

class StockCalculator {
    constructor() {
        this.initElements();
        this.bindEvents();
        this.calculationData = null;
        
        // بدء التطبيق
        this.initApp();
    }

    initElements() {
        // Screens
        this.splashScreen = document.getElementById('splash-screen');
        this.mainApp = document.getElementById('main-app');
        this.resultScreen = document.getElementById('result-screen');

        // Form elements
        this.form = document.getElementById('stock-form');
        this.stockName = document.getElementById('stock-name');
        this.sharesCount = document.getElementById('shares-count');
        this.purchasePricePerShare = document.getElementById('purchase-price-per-share');
        this.totalPurchasePrice = document.getElementById('total-purchase-price');
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

    initApp() {
        // إخفاء splash بعد 2.5 ثانية وإظهار التطبيق
        setTimeout(() => {
            this.splashScreen.classList.add('hide');
            this.mainApp.classList.add('show');
            
            // إزالة splash من DOM بعد الانتهاء
            setTimeout(() => {
                this.splashScreen.style.display = 'none';
            }, 500);
        }, 2500);
    }

    bindEvents() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculate();
        });

        // Smart calculation between price per share and total
        this.purchasePricePerShare.addEventListener('input', () => {
            if (this.purchasePricePerShare.value && this.sharesCount.value) {
                const total = parseFloat(this.purchasePricePerShare.value) * parseInt(this.sharesCount.value);
                this.totalPurchasePrice.value = total.toFixed(2);
            }
        });

        this.totalPurchasePrice.addEventListener('input', () => {
            if (this.totalPurchasePrice.value && this.sharesCount.value) {
                const perShare = parseFloat(this.totalPurchasePrice.value) / parseInt(this.sharesCount.value);
                this.purchasePricePerShare.value = perShare.toFixed(2);
            }
        });

        this.sharesCount.addEventListener('input', () => {
            if (this.purchasePricePerShare.value) {
                const total = parseFloat(this.purchasePricePerShare.value) * parseInt(this.sharesCount.value || 0);
                this.totalPurchasePrice.value = total.toFixed(2);
            } else if (this.totalPurchasePrice.value) {
                const perShare = parseFloat(this.totalPurchasePrice.value) / parseInt(this.sharesCount.value || 1);
                this.purchasePricePerShare.value = perShare.toFixed(2);
            }
        });

        // Commission logic (only one can be used)
        this.commissionPercent.addEventListener('input', () => {
            if (this.commissionPercent.value) {
                this.commissionAmount.value = '';
            }
        });

        this.commissionAmount.addEventListener('input', () => {
            if (this.commissionAmount.value) {
                this.commissionPercent.value = '';
            }
        });

        // Navigation buttons
        this.backBtn.addEventListener('click', () => this.showMainApp());
        this.newCalcBtn.addEventListener('click', () => this.showMainApp());
        this.downloadBtn.addEventListener('click', () => this.downloadReceipt());
    }

    calculate() {
        const shares = parseInt(this.sharesCount.value);
        const purchasePrice = parseFloat(this.purchasePricePerShare.value) || 0;
        const current = parseFloat(this.currentPrice.value);
        const commissionPercent = parseFloat(this.commissionPercent.value) || 0;
        const commissionAmount = parseFloat(this.commissionAmount.value) || 0;

        // Validation
        if (!shares || !current) {
            alert('الرجاء إدخال عدد الأسهم والسعر الحالي');
            return;
        }

        // Calculate total purchase
        const totalPurchase = purchasePrice * shares;

        // Calculate current value
        const currentValue = current * shares;

        // Calculate commission
        let commission = 0;
        if (commissionPercent > 0) {
            commission = (currentValue * commissionPercent) / 100;
        } else if (commissionAmount > 0) {
            commission = commissionAmount;
        }

        // Calculate profit/loss
        const grossProfit = currentValue - totalPurchase;
        const netProfit = grossProfit - commission;
        const profitPercent = totalPurchase > 0 ? (netProfit / totalPurchase) * 100 : 0;

        // Total selling amount (after commission)
        const totalSelling = currentValue - commission;

        this.calculationData = {
            stockName: this.stockName.value || 'غير معروف',
            shares: shares,
            purchasePrice: purchasePrice,
            totalPurchase: totalPurchase,
            currentPrice: current,
            currentValue: currentValue,
            commission: commission,
            commissionPercent: commissionPercent,
            grossProfit: grossProfit,
            netProfit: netProfit,
            profitPercent: profitPercent,
            totalSelling: totalSelling,
            date: new Date().toLocaleDateString('ar-SA'),
            time: new Date().toLocaleTimeString('ar-SA')
        };

        this.generateReceipt();
        this.showResultScreen();
    }

    generateReceipt() {
        const ctx = this.ctx;
        const data = this.calculationData;
        const width = 600;
        const height = 800;

        // Clear canvas
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Background pattern
        ctx.fillStyle = '#F8F9FA';
        for (let i = 0; i < width; i += 20) {
            for (let j = 0; j < height; j += 20) {
                if ((i + j) % 40 === 0) {
                    ctx.fillRect(i, j, 2, 2);
                }
            }
        }

        // Header background
        const gradient = ctx.createLinearGradient(0, 0, width, 150);
        gradient.addColorStop(0, '#1A1F2E');
        gradient.addColorStop(1, '#2D3748');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, 150);

        // Gold accent line
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(0, 150, width, 4);

        // Title
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 32px Tajawal, Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Stock Profit Calculator', width / 2, 60);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px Tajawal, Arial';
        ctx.fillText('By ER1991', width / 2, 95);

        ctx.fillStyle = '#A0AEC0';
        ctx.font = '16px Tajawal, Arial';
        ctx.fillText('© ER1991 2026', width / 2, 125);

        // Content area
        let y = 190;

        // Stock Name
        ctx.fillStyle = '#1A1F2E';
        ctx.font = 'bold 28px Tajawal, Arial';
        ctx.textAlign = 'right';
        ctx.fillText(data.stockName, width - 40, y);

        ctx.fillStyle = '#718096';
        ctx.font = '16px Tajawal, Arial';
        ctx.fillText('اسم السهم', width - 40, y + 25);

        y += 70;

        // Divider
        this.drawDivider(ctx, 40, y - 20, width - 80);

        // Details grid
        const col1 = width - 40;
        const col2 = 40;

        // Purchase Details
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 20px Tajawal, Arial';
        ctx.textAlign = 'right';
        ctx.fillText('تفاصيل الشراء', col1, y);

        y += 35;

        ctx.fillStyle = '#2D3748';
        ctx.font = 'bold 18px Tajawal, Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${data.shares} سهم`, col1, y);
        ctx.textAlign = 'left';
        ctx.fillText(`$${data.purchasePrice.toFixed(2)}`, col2, y);

        ctx.fillStyle = '#718096';
        ctx.font = '14px Tajawal, Arial';
        ctx.textAlign = 'right';
        ctx.fillText('الكمية × السعر', col1, y + 20);
        ctx.textAlign = 'left';
        ctx.fillText('سعر السهم الواحد', col2, y + 20);

        y += 50;

        // Total Purchase
        ctx.fillStyle = '#2D3748';
        ctx.font = 'bold 22px Tajawal, Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`$${data.totalPurchase.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, col1, y);
        
        ctx.fillStyle = '#718096';
        ctx.font = '14px Tajawal, Arial';
        ctx.fillText('إجمالي الشراء', col1, y + 22);

        y += 60;
        this.drawDivider(ctx, 40, y - 20, width - 80);

        // Current Value
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 20px Tajawal, Arial';
        ctx.fillText('القيمة الحالية', col1, y);

        y += 35;

        ctx.fillStyle = '#2D3748';
        ctx.font = 'bold 18px Tajawal, Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`$${data.currentPrice.toFixed(2)}`, col2, y);
        ctx.textAlign = 'right';
        ctx.fillText(`$${data.currentValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, col1, y);

        ctx.fillStyle = '#718096';
        ctx.font = '14px Tajawal, Arial';
        ctx.textAlign = 'left';
        ctx.fillText('السعر الحالي', col2, y + 20);
        ctx.textAlign = 'right';
        ctx.fillText('القيمة السوقية', col1, y + 20);

        y += 60;
        this.drawDivider(ctx, 40, y - 20, width - 80);

        // Commission
        if (data.commission > 0) {
            ctx.fillStyle = '#E53E3E';
            ctx.font = 'bold 18px Tajawal, Arial';
            ctx.textAlign = 'right';
            ctx.fillText(`-$${data.commission.toFixed(2)}`, col1, y);
            
            ctx.fillStyle = '#718096';
            ctx.font = '14px Tajawal, Arial';
            const commissionLabel = data.commissionPercent > 0 ? `عمولة (${data.commissionPercent}%)` : 'عمولة ثابتة';
            ctx.fillText(commissionLabel, col1, y + 20);

            y += 50;
            this.drawDivider(ctx, 40, y - 20, width - 80);
        }

        // Result Box
        const isProfit = data.netProfit >= 0;
        const resultColor = isProfit ? '#48BB78' : '#E53E3E';
        const resultText = isProfit ? 'ربح' : 'خسارة';

        // Result background
        ctx.fillStyle = resultColor + '15';
        ctx.fillRect(40, y, width - 80, 120);
        ctx.strokeStyle = resultColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(40, y, width - 80, 120);

        y += 40;

        ctx.fillStyle = resultColor;
        ctx.font = 'bold 24px Tajawal, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(resultText, width / 2, y);

        y += 35;

        ctx.fillStyle = '#1A1F2E';
        ctx.font = 'bold 36px Tajawal, Arial';
        const profitText = `${isProfit ? '+' : ''}$${Math.abs(data.netProfit).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        ctx.fillText(profitText, width / 2, y);

        y += 30;

        ctx.fillStyle = resultColor;
        ctx.font = 'bold 20px Tajawal, Arial';
        const percentText = `${isProfit ? '+' : ''}${data.profitPercent.toFixed(2)}%`;
        ctx.fillText(percentText, width / 2, y);

        y += 60;

        // Total Selling Amount
        ctx.fillStyle = '#2D3748';
        ctx.font = 'bold 20px Tajawal, Arial';
        ctx.fillText('إجمالي البيع الصافي:', width / 2, y);

        y += 35;

        ctx.fillStyle = '#1A1F2E';
        ctx.font = 'bold 32px Tajawal, Arial';
        ctx.fillText(`$${data.totalSelling.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, width / 2, y);

        y += 50;

        // Footer
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(0, height - 60, width, 60);

        ctx.fillStyle = '#718096';
        ctx.font = '14px Tajawal, Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${data.date} | ${data.time}`, width / 2, height - 35);
        
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 14px Tajawal, Arial';
        ctx.fillText('© ER1991 2026', width / 2, height - 15);
    }

    drawDivider(ctx, x, y, width) {
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    showResultScreen() {
        this.resultScreen.classList.remove('hidden');
        // Force reflow
        void this.resultScreen.offsetWidth;
        this.resultScreen.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    showMainApp() {
        this.resultScreen.classList.remove('show');
        setTimeout(() => {
            this.resultScreen.classList.add('hidden');
        }, 300);
        document.body.style.overflow = '';
        this.form.reset();
    }

    downloadReceipt() {
        const link = document.createElement('a');
        link.download = `transaction_receipt_By_ER1991_${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StockCalculator();
});
