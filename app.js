// المتغيرات العامة
let calculationData = {};
let currentLang = 'ar'; // اللغة الافتراضية

// تبديل اللغة
document.getElementById('langBtn').addEventListener('click', toggleLanguage);

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    // تحديث الخط
    document.body.style.fontFamily = currentLang === 'ar' ? "'Cairo', sans-serif" : "'Poppins', sans-serif";
    
    // تحديث نص زر اللغة
    document.querySelector('.lang-text').textContent = currentLang === 'ar' ? 'EN' : 'AR';
    
    // تحديث جميع النصوص في الصفحة
    document.querySelectorAll('[data-ar][data-en]').forEach(element => {
        element.textContent = element.getAttribute(`data-${currentLang}`);
    });
    
    // تحديث placeholder
    document.querySelectorAll('input[placeholder]').forEach(input => {
        const originalPlaceholder = input.getAttribute('placeholder');
        const arPlaceholder = input.getAttribute('data-ar') || originalPlaceholder;
        const enPlaceholder = input.getAttribute('data-en') || originalPlaceholder;
        
        if (currentLang === 'ar') {
            input.placeholder = arPlaceholder;
        } else {
            input.placeholder = enPlaceholder;
        }
    });
}

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

    // حساب إجمالي الشراء بالعمولة
    const totalWithCommission = calculatedTotalPurchase + commission;

    // حساب إجمالي بيع الأسهم
    const totalSelling = currentPrice * shares;

    // حساب الربح/الخسارة (بعد خصم العمولة)
    const profitLoss = totalSelling - totalWithCommission;

    // حساب النسبة المئوية
    const percentage = ((profitLoss / totalWithCommission) * 100).toFixed(2);

    // تخزين البيانات للعرض
    calculationData = {
        stockName: stockName,
        shares: shares,
        purchasePrice: calculatedPurchasePrice.toFixed(2),
        totalPurchase: calculatedTotalPurchase.toFixed(2),
        totalWithCommission: totalWithCommission.toFixed(2),
        commission: commission.toFixed(2),
        currentPrice: currentPrice.toFixed(2),
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
    document.getElementById('resultStockName').textContent = calculationData.stockName;
    document.getElementById('resultShares').textContent = calculationData.shares;
    document.getElementById('resultTotalPurchase').textContent = `${calculationData.totalPurchase} SAR`;
    document.getElementById('resultTotalWithCommission').textContent = `${calculationData.totalWithCommission} SAR`;
    document.getElementById('resultCommission').textContent = `${calculationData.commission} SAR`;
    document.getElementById('resultTotalSelling').textContent = `${calculationData.totalSelling} SAR`;
    document.getElementById('resultProfitLoss').textContent = `${calculationData.profitLoss} SAR`;
    document.getElementById('resultPercentage').textContent = `${calculationData.percentage}%`;

    // تغيير لون الربح/الخسارة
    const profitLossElement = document.getElementById('resultProfitLoss');
    if (parseFloat(calculationData.profitLoss) >= 0) {
        profitLossElement.style.color = '#27ae60';
        profitLossElement.parentElement.parentElement.style.background = 
            'linear-gradient(135deg, rgba(39, 174, 96, 0.2), rgba(46, 204, 113, 0.1))';
    } else {
        profitLossElement.style.color = '#e74c3c';
        profitLossElement.parentElement.parentElement.style.background = 
            'linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(231, 76, 60, 0.1))';
    }

    // تغيير لون النسبة المئوية
    const percentageElement = document.getElementById('resultPercentage');
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
    
    // العنوان الرئيسي
    ctx.font = 'bold 30px "Poppins", sans-serif';
    ctx.fillStyle = '#1a2a6c';
    ctx.textAlign = 'center';
    ctx.fillText('Stock Profit Calculator', canvas.width / 2, 50);
    
    ctx.font = '20px "Poppins", sans-serif';
    ctx.fillText('By ER1991', canvas.width / 2, 85);
    
    // خط فاصل
    const gradient = ctx.createLinearGradient(0, 100, canvas.width, 100);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(40, 110);
    ctx.lineTo(canvas.width - 40, 110);
    ctx.stroke();
    
    // بيانات الحساب
    ctx.font = 'bold 18px "Poppins", sans-serif';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'left';
    
    let yPos = 160;
    const lineHeight = 35;
    
    // معلومات السهم
    ctx.fillText(`Stock Name: ${calculationData.stockName}`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`Number of Shares: ${calculationData.shares}`, 50, yPos);
    yPos += lineHeight * 1.5;
    
    // أسعار الشراء
    ctx.fillStyle = '#667eea';
    ctx.fillText('Purchase Information:', 50, yPos);
    yPos += lineHeight;
    
    ctx.fillStyle = '#333';
    ctx.fillText(`Share Price: ${calculationData.purchasePrice} SAR`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`Total Purchase (Excl. Commission): ${calculationData.totalPurchase} SAR`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`Commission: ${calculationData.commission} SAR`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillStyle = '#27ae60';
    ctx.fillText(`Total Purchase (Incl. Commission): ${calculationData.totalWithCommission} SAR`, 50, yPos);
    yPos += lineHeight * 1.5;
    
    // السعر الحالي والإجمالي
    ctx.fillStyle = '#333';
    ctx.fillText(`Current Share Price: ${calculationData.currentPrice} SAR`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillStyle = '#e74c3c';
    ctx.fillText(`Total Selling Amount: ${calculationData.totalSelling} SAR`, 50, yPos);
    yPos += lineHeight * 1.5;
    
    // النتائج النهائية
    ctx.fillStyle = '#764ba2';
    ctx.font = 'bold 22px "Poppins", sans-serif';
    ctx.fillText('Results:', 50, yPos);
    yPos += lineHeight;
    
    ctx.fillStyle = parseFloat(calculationData.profitLoss) >= 0 ? '#27ae60' : '#e74c3c';
    ctx.fillText(`Profit/Loss: ${calculationData.profitLoss} SAR`, 50, yPos);
    yPos += lineHeight;
    
    ctx.fillText(`Percentage: ${calculationData.percentage}%`, 50, yPos);
    yPos += lineHeight * 2;
    
    // حقوق النشر
    ctx.font = '12px "Poppins", sans-serif';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('© ER1991 2026 - All Rights Reserved', canvas.width / 2, canvas.height - 40);
    
    // إطار متدرج
    const frameGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    frameGradient.addColorStop(0, '#667eea');
    frameGradient.addColorStop(0.5, '#764ba2');
    frameGradient.addColorStop(1, '#f093fb');
    
    ctx.strokeStyle = frameGradient;
    ctx.lineWidth = 6;
    ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);
    
    // زوايا مزخرفة
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(30, 30,
