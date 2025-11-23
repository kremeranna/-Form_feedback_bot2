document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    sendToTelegram(formData);
});

async function sendToTelegram(data) {
    const botToken = '7753728710:AAHtoiZjBAPcVMpmiOw7NLzqDkCrHNA_2H8';
    const chatId = '-1003326967947';
    
    const message = `📨 Новое сообщение с сайта:\n\n👤 Имя: ${data.name}\n📞 Телефон: ${data.phone}\n📝 Сообщение: ${data.message}`;
    
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        // Показываем уведомление об отправке
        showNotification('📤 Отправляем сообщение...', 'sending');
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });

        const result = await response.json();
        
        if (result.ok) {
            // Показываем уведомление об успехе
            showNotification('✅ Сообщение успешно отправлено!', 'success');
            document.getElementById('contactForm').reset();
        } else {
            throw new Error(result.description);
        }
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('❌ Ошибка отправки. Попробуйте позже.', 'error');
    }
}

// Функция для показа красивого уведомления
function showNotification(message, type) {
    // Удаляем предыдущее уведомление если есть
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Добавляем стили
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(400px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    // Цвета в зависимости от типа
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
    } else if (type === 'sending') {
        notification.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
    }
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Автоматическое скрытие (кроме состояния отправки)
    if (type !== 'sending') {
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }
    
    // Возвращаем элемент для возможности ручного управления
    return notification;
}

// Функция для скрытия уведомления отправки
function hideSendingNotification() {
    const sendingNotification = document.querySelector('.notification.sending');
    if (sendingNotification) {
        sendingNotification.style.transform = 'translateX(400px)';
        sendingNotification.style.opacity = '0';
        setTimeout(() => {
            if (sendingNotification.parentNode) {
                sendingNotification.remove();
            }
        }, 300);
    }
}

// Обновляем функцию showResponse для использования новых уведомлений
function showResponse(text, className) {
    // Скрываем уведомление отправки если было
    if (className !== 'sending') {
        hideSendingNotification();
    }
    
    showNotification(text, className);
}