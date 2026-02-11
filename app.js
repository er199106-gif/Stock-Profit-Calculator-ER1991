// المتغيرات العامة
let calculationData = {};
let currentLang = 'ar'; // اللغة الافتراضية
let isCalculating = false;

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

// تحديث حسابات الشراء تلقائياً
function updatePurchaseCalculations() {
    if (isCalculating) return;
    isCalculating = true;
    
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    const shares = parseFloat(document.getElementById('shares').value) || 0;
    const totalPurchase = parseFloat(document.getElementById('totalPurchase').value) || 0;
    const totalPurchaseIncl = parseFloat(document.getElementById('totalPurchaseIncl').value) || 0;
    const commissionPercent = parseFloat(document.getElementById('commissionPercent').value) || 0;
    const commissionAmount = parseFloat(document.getElementById('commissionAmount').value) || 0;

    // إذا تم إدخال سعر الشراء وعدد الأسهم
    if (purchasePrice > 0 && shares > 0 && totalPurchase === 0 && totalPurchaseIncl === 0) {
        const calculatedTotalPurchase = purchasePrice * shares;
        document.getElementById('totalPurchase').value = calculatedTotalPurchase.toFixed(2);
        document.getElementById('totalPurchaseIncl').value = calculatedTotalPurchase.toFixed(2);
    }

    // إذا تم إدخال إجمالي الشراء وعدد الأسهم
    if (totalPurchase > 0 && shares > 0 && purchasePrice === 0) {
        document.getElementById('purchasePrice').value = (totalPurchase / shares).toFixed(2);
    }

    // إذا تم إدخال إجمالي الشراء بالعمولة
    if (totalPurchaseIncl > 0 && totalPurchase > 0 && commissionAmount === 0 && commissionPercent === 0) {
        document.getElementById('commissionAmount').value = (totalPurchaseIncl - totalPurchase).toFixed(2);
        document.getElementById('commissionPercent').value = ((totalPurchaseIncl - totalPurchase) / totalPurchase * 100).toFixed(2);
    }

    // إذا تم إدخال مبلغ العمولة
    if (commissionAmount > 0 && totalPurchase > 0 && totalPurchaseIncl === 0) {
        document.getElementById('totalPurchaseIncl').value = (totalPurchase + commissionAmount).toFixed(2);
        document.getElementById('commissionPercent').value = (commissionAmount / totalPurchase * 100).toFixed(2);
    }

    // إذا تم إدخال نسبة العمولة
    if (commissionPercent > 0 && totalPurchase > 0 && commissionAmount === 0) {
        const calculatedCommission = (totalPurchase * commissionPercent) / 100;
        document.getElementById('commissionAmount').value = calculatedCommission.toFixed(2);
        document.getElementById('totalPurchaseIncl').value = (totalPurchase + calculatedCommission).toFixed(2);
    }
    
    isCalculating = false;
}

// تحديث حسابات البيع تلقائياً
function updateSellingCalculations() {
    if (isCalculating) return;
    isCalculating = true;
    
    const shares = parseFloat(document.getElementById('shares').value) || 0;
    const currentPrice = parseFloat(document.getElementById('currentPrice').value) || 0;
    const sellingCommissionPercent = parseFloat(document.getElementById('sellingCommissionPercent').value) || 0;
    const sellingCommissionAmount = parseFloat(document.getElementById('sellingCommissionAmount').value) || 0;
    const totalSelling = currentPrice * shares;

    // إذا تم إدخال نسبة عمولة البيع
    if (sellingCommissionPercent > 0 && totalSelling > 0 && sellingCommissionAmount === 0) {
        const calculatedCommission = (totalSelling * sellingCommissionPercent) / 100;
        document.getElementById('sellingCommissionAmount').value = calculatedCommission.toFixed(2);
    }

    // إذا تم إدخال مبلغ عمولة البيع
    if (sellingCommissionAmount > 0 && totalSelling > 0 && sellingCommissionPercent === 0) {
        const calculatedPercent = (sellingCommissionAmount / totalSelling) * 100;
        document.getElementById('sellingCommissionPercent').value = calculatedPercent.toFixed(2);
    }
    
    isCalculating = false;
}

// إعداد المستمعات لـ حسابات الشراء
document.getElementById('purchasePrice').addEventListener('input', updatePurchaseCalculations);
document.getElementById('shares').addEventListener('input', updatePurchaseCalculations);
document.getElementById('totalPurchase').addEventListener('input', updatePurchaseCalculations);
document.getElementById('totalPurchaseIncl').addEventListener('input', updatePurchaseCalculations);
document.getElementById('commissionPercent').addEventListener('input', updatePurchaseCalculations);
document.getElementById('commissionAmount').addEventListener('input', updatePurchaseCalculations);

// إعداد المستمعات لـ حسابات البيع
document.getElementById('currentPrice').addEventListener('input', updateSellingCalculations);
document.getElementById('shares').addEventListener('input', updateSellingCalculations);
document.getElementById('sellingCommissionPercent').addEventListener('input', updateSellingCalculations);
document.getElementById('sellingCommissionAmount').addEventListener('input', updateSellingCalculations);

// حساب النتائج باستخدام المعادلات الدقيقة
function calculateResults() {
    const stockName = document.getElementById('stockName').value;
    const shares = parseFloat(document.getElementById('shares').value);
    const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
    const totalPurchase = parseFloat(document.getElementById('totalPurchase').value) || 0;
    const totalPurchaseIncl = parseFloat(document.getElementById('totalPurchaseIncl').value) || 0;
    const currentPrice = parseFloat(document.getElementById('currentPrice').value);
    const commissionPercent = parseFloat(document.getElementById('commissionPercent').value) || 0;
    const commissionAmount = parseFloat(document.getElementById('commissionAmount').value) || 0;
    const sellingCommissionPercent = parseFloat(document.getElementById('sellingCommissionPercent').value) || 0;
    const sellingCommissionAmount = parseFloat(document.getElementById('sellingCommissionAmount').value) || 0;

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
    let calculatedCommissionAmount = commissionAmount;
    if (commissionPercent > 0 && calculatedTotalPurchase > 0) {
        calculatedCommissionAmount = (calculatedTotalPurchase * commissionPercent) / 100;
    }

    // حساب إجمالي الشراء بالعمولة
    const totalWithCommission = calculatedTotalPurchase + calculatedCommissionAmount;

    // حساب إجمالي بيع الأسهم
    const totalSelling = currentPrice * shares;

    // حساب عمولة البيع
    let calculatedSellingCommission = sellingCommissionAmount;
    if (sellingCommissionPercent > 0) {
        calculatedSellingCommission = (totalSelling * sellingCommissionPercent) / 100;
    }

    // حساب إجمالي البيع بعد خصم عمولة البيع
    const netSelling = totalSelling - calculatedSellingCommission;

    // حساب الربح/الخسارة (بعد خصم جميع العمولات)
    const profitLoss = netSelling - totalWithCommission;

    // حساب النسبة المئوية (بناءً على إجمالي الشراء بالعمولة)
    const percentage = ((profitLoss / totalWithCommission) * 100).toFixed(2);

    // تخزين البيانات للعرض
    calculationData = {
        stockName: stockName,
        shares: shares,
        purchasePrice: calculatedPurchasePrice.toFixed(2),
        totalPurchase: calculatedTotalPurchase.toFixed(2),
        totalWithCommission: totalWithCommission.toFixed(2),
        commission: calculatedCommissionAmount.toFixed(2),
        currentPrice: currentPrice.toFixed(2),
        totalSelling: totalSelling.toFixed(2),
        sellingCommission: calculatedSellingCommission.toFixed(2),
        netSelling: netSelling.toFixed(2),
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
    document.getElementById('resultPurchasePrice').textContent = `${calculationData.purchasePrice} SAR`;
    document.getElementById('resultTotalPurchase').textContent = `${calculationData.totalPurchase} SAR`;
    document.getElementById('resultTotalWithCommission').textContent = `${calculationData.totalWithCommission} SAR`;
    document.getElementById('resultCommission').textContent = `${calculationData.commission} SAR`;
    document.getElementById('resultCurrentPrice').textContent = `${calculationData.currentPrice} SAR`;
    document.getElementById('resultTotalSelling').textContent = `${calculationData.totalSelling} SAR`;
    document.getElementById('resultSellingCommission').textContent = `${calculationData.sellingCommission} SAR`;
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
    
    // إضافة حدود بنفسجية
    const purpleGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    purpleGradient.addColorStop(0, '#667eea');
    purpleGradient.addColorStop(1, '#764ba2');
    
    ctx.strokeStyle = purpleGradient;
    ctx.lineWidth = 8;
    ctx.roundRect(15, 15, canvas.width - 30, canvas.height - 30, 15);
    ctx.stroke();
    
    // إضافة حدود داخلية
    ctx.strokeStyle = '#dcdcdc';
    ctx.lineWidth = 1;
    ctx.roundRect(20, 20, canvas.width - 40, canvas.height - 40, 10);
    ctx.stroke();
    
    // العنوان الرئيسي
    ctx.font = 'bold 30px "Poppins", sans-serif';
    ctx.fillStyle = '#1a2a6c';
    ctx.textAlign = 'center';
    ctx.fillText('Stock Profit Calculator', canvas.width / 2, 60);
    
    ctx.font = '20px "Poppins", sans-serif';
    ctx.fillStyle = '#764ba2';
    ctx.fillText('By ER1991', canvas.width / 2, 90);
    
    // خط فاصل
    ctx.beginPath();
    ctx.moveTo(40, 115);
    ctx.lineTo(canvas.width - 40, 115);
    ctx.strokeStyle = '#dcdcdc';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // مقدمة البيانات
    ctx.font = '18px "Poppins", sans-serif';
    ctx.fillStyle = '#667eea';
    ctx.fillText('Purchase Information:', 45, 150);
    
    // بيانات الشراء
    ctx.font = '16px "Poppins", sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText(`Stock Name: ${calculationData.stockName}`, 45, 180);
    ctx.fillText(`Number of Shares: ${calculationData.shares}`, 45, 205);
    ctx.fillText(`Share Price: ${calculationData.purchasePrice} SAR`, 45, 230);
    ctx.fillText(`Total Purchase (Excl. Commission): ${calculationData.totalPurchase} SAR`, 45, 255);
    ctx.fillText(`Commission: ${calculationData.commission} SAR`, 45, 280);
    ctx.fillText(`Total Purchase (Incl. Commission): ${calculationData.totalWithCommission} SAR`, 45, 305);
    
    // خط فاصل
    ctx.beginPath();
    ctx.moveTo(40, 335);
    ctx.lineTo(canvas.width - 40, 335);
    ctx.strokeStyle = '#dcdcdc';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // بيانات البيع
    ctx.font = '18px "Poppins", sans-serif';
    ctx.fillStyle = '#667eea';
    ctx.fillText('Selling Information:', 45, 360);
    
    ctx.font = '16px "Poppins", sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText(`Current Share Price: ${calculationData.currentPrice} SAR`, 45, 385);
    ctx.fillText(`Total Selling Amount: ${calculationData.totalSelling} SAR`, 45, 410);
    ctx.fillText(`Selling Commission: ${calculationData.sellingCommission} SAR`, 45, 435);
    
    // خط فاصل
    ctx.beginPath();
    ctx.moveTo(40, 465);
    ctx.lineTo(canvas.width - 40, 465);
    ctx.strokeStyle = '#dcdcdc';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // النتائج النهائية
    ctx.font = '20px "Poppins", sans-serif';
    ctx.fillStyle = '#764ba2';
    ctx.fillText('Results:', 45, 500);
    
    ctx.font = '18px "Poppins", sans-serif';
    ctx.fillStyle = parseFloat(calculationData.profitLoss) >= 0 ? '#27ae60' : '#e74c3c';
    ctx.fillText(`Profit/Loss: ${calculationData.profitLoss} SAR`, 45, 530);
    
    ctx.font = '18px "Poppins", sans-serif';
    ctx.fillStyle = '#333';
    ctx.fillText(`Percentage: ${calculationData.percentage}%`, 45, 555);
    
    // حقوق النشر
    ctx.font = '12px "Poppins", sans-serif';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('© ER1991 2026 - All Rights Reserved', canvas.width / 2, canvas.height - 40);
    
    // إضافة شعار
    ctx.font = '14px "Poppins", sans-serif';
    ctx.fillStyle = '#764ba2';
    ctx.textAlign = 'right';
    ctx.fillText('Stock Profit Calculator', canvas.width - 45, 30);
    
    // إضافة ختم
    ctx.font = '12px "Poppins", sans-serif';
    ctx.fillStyle = '#dcdcdc';
    ctx.textAlign = 'center';
    ctx.fillText('APPROVED', canvas.width / 2, 650);
    
    // إضافة خطوط تزيين
    ctx.strokeStyle = '#dcdcdc';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(40, 600);
    ctx.lineTo(canvas.width - 40, 600);
    ctx.stroke();
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
console.log('Current Language:', currentLang);
