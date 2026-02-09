// المتغيرات العامة
let calculationData = {};

// شاشة البداية - الانتقال التلقائي
setTimeout(() => {
    // إخفاء شاشة البداية
    document.getElementById('splashScreen').classList.remove('splash-active');
    
    // إظهار شاشة الحاسبة
    document.getElementById('calculatorScreen').classList.add('calculator-active');
}, 3000);

// معالجة نموذج الحساب
document.getElementById('stockForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateResults();
});

// حساب النتائج باستخدام المعادلات الدقيقة
function calculateResults() {
    const stockName = document.getElementById('stockName').value;
    const shares = parseFloat(document.getElementById('shares').value);
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    const totalPurchase = parseFloat(document.getElementById('totalPurchase').value) || 0;
    const currentPrice = parseFloat(document.getElementById('currentPrice').value);
    const commissionPercent = parseFloat(document.getElementById('commissionPercent').value) || 0;
    const commissionAmount = parseFloat(document.getElementById('commissionAmount').value) || 0;

    // حساب سعر الشراء للسهم إذا لم يدخل
    let calculatedPurchasePrice = purchasePrice;
    if (!purchasePrice && totalPurchase) {
        calculatedPurchasePrice = totalPurchase / shares;
    }

    // حساب إجمالي سعر الشراء إذا لم يدخل
    let calculatedTotalPurchase = totalPurchase;
    if (!totalPurchase && purchasePrice) {
        calculatedTotalPurchase = purchasePrice * shares;
    }

    // حساب العمولة
    let commission = 0;
    if (commissionPercent > 0) {
        commission = (calculatedTotalPurchase * commissionPercent) / 100;
    } else if (commissionAmount > 0) {
        commission = commissionAmount;
    }

    // حساب إجمالي بيع الأسهم
    const totalSelling = currentPrice * shares;

    // حساب الربح/الخسارة
    const profitLoss = totalSelling - calculatedTotalPurchase - commission;

    // حساب النسبة المئوية
    const percentage = ((profitLoss / calculatedTotalPurchase) * 100).toFixed(2);

    // تخزين البيانات للعرض
    calculationData = {
        stockName: stockName,
        shares: shares,
        purchasePrice: calculatedPurchasePrice.toFixed(2),
        totalPurchase: calculatedTotalPurchase.toFixed(2),
        currentPrice: currentPrice.toFixed(2),
        commission: commission.toFixed(2),
        totalSelling: totalSelling.toFixed(2),
        profitLoss: profitLoss.toFixed(2),
        percentage: percentage
    };

    // عرض النتائج
    displayResults();
    generateReceipt();
}

// عرض النتائج في الشاشة
function displayResults() {
    document.getElementById('profitLoss').textContent = `${calculationData.profitLoss} SAR`;
    document.getElementById('percentage').textContent = `${calculationData.percentage}%`;
    document.getElementById('totalSelling').textContent = `${calculationData.totalSelling} SAR`;
    document.getElementById('resultShares').textContent = calculationData.shares;
    document.getElementById('resultStockName').textContent = calculationData.stockName;

    // تغيير لون الربح/الخسارة
    const profitLossElement = document.getElementById('profitLoss');
    if (parseFloat(calculationData.profitLoss) >= 0) {
        profitLossElement.style.color = '#27ae60';
    } else {
        profitLossElement.style.color = '#e74c3c';
    }

    // تغيير لون النسبة المئوية
    const percentageElement = document.getElementById('percentage');
    if (parseFloat(calculationData.percentage) >= 0) {
        percentageElement.style.color = '#27ae60';
    } else {
        percentageElement.style.color = '#e74c3c';
    }

    // الانتقال لشاشة النتائج
    document.getElementById('calculatorScreen').classList.remove('calculator-active');
    document.getElementById('resultScreen').classList.add('result-active');
}

// إنشاء صورة الإيصال باستخدام Canvas
function generateReceipt() {
    const canvas = document.getElementById('receiptCanvas');
    const ctx = canvas.getContext('2d');
    
    // إعدادات القماش
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // الخطوط
    ctx.font = 'bold 24px "Cairo", sans-serif';
    ctx.fillStyle = '#1a2a6c';
    ctx.textAlign = 'center';
    
    // العنوان
    ctx.fillText('Stock Profit Calculator', canvas.width / 2, 50);
    ctx.font = '16px "Cairo", sans-serif';
    ctx.fillText('By ER1991', canvas.width / 2, 80);
    
    // خط فاصل
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, 100);
    ctx.lineTo(canvas.width - 40, 100);
    ctx.stroke();
    
    // بيانات الحساب
    ctx.font = 'bold 18px "Cairo", sans-serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    
    let yPos = 150;
    const lineHeight = 40;
    
    ctx.fillText(`اسم السهم: ${calculationData.stockName}`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`عدد الأسهم: ${calculationData.shares}`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`سعر الشراء: ${calculationData.purchasePrice} SAR`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`السعر الحالي: ${calculationData.currentPrice} SAR`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`إجمالي الشراء: ${calculationData.totalPurchase} SAR`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`العمولة: ${calculationData.commission} SAR`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`إجمالي البيع: ${calculationData.totalSelling} SAR`, 50, yPos);
    yPos += lineHeight * 1.5;
    
    // النتائج النهائية
    ctx.font = 'bold 22px "Cairo", sans-serif';
    ctx.fillStyle = '#ffd700';
    
    ctx.fillText('النتائج:', 50, yPos);
    yPos += lineHeight;
    
    ctx.fillStyle = parseFloat(calculationData.profitLoss) >= 0 ? '#27ae60' : '#e74c3c';
    ctx.fillText(`الربح/الخسارة: ${calculationData.profitLoss} SAR`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`النسبة: ${calculationData.percentage}%`, 50, yPos);
    yPos += lineHeight * 2;
    
    // حقوق النشر
    ctx.font = '12px "Cairo", sans-serif';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('© ER1991 2026 - جميع الحقوق محفوظة', canvas.width / 2, canvas.height - 30);
    
    // إطار ذهبي
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);
}

// تحميل صورة الإيصال
function downloadReceipt() {
    const canvas = document.getElementById('receiptCanvas');
    const link = document.createElement('a');
    link.download = 'transaction_receipt_By_ER1991.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

// إعادة تعيين الحاسبة
function resetCalculator() {
    document.getElementById('stockForm').reset();
    document.getElementById('resultScreen').classList.remove('result-active');
    document.getElementById('calculatorScreen').classList.add('calculator-active');
}

// منطق ذكي للحساب التلقائي
document.getElementById('purchasePrice').addEventListener('input', function() {
    const purchasePrice = parseFloat(this.value);
    const shares = parseFloat(document.getElementById('shares').value);
    if (purchasePrice && shares) {
        document.getElementById('totalPurchase').value = (purchasePrice * shares).toFixed(2);
    }
});

document.getElementById('totalPurchase').addEventListener('input', function() {
    const totalPurchase = parseFloat(this.value);
    const shares = parseFloat(document.getElementById('shares').value);
    if (totalPurchase && shares) {
        document.getElementById('purchasePrice').value = (totalPurchase / shares).toFixed(2);
    }
});

// منع إدخال قيم سالبة
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        if (parseFloat(this.value) < 0) {
            this.value = '0';
        }
    });
});

// إضافة console.log للتأكد من التشغيل
console.log('Stock Profit Calculator - ER1991 loaded successfully');
