class Need {
  constructor(data) {
    Object.assign(this, data);
  }
  static async filter(conditions = {}, sortBy = '-priority', limit = 10) {
    const mockNeeds = [
      {
        id: 1,
        title_en: "Medical Supplies & Healthcare",
        title_hi: "चिकित्सा आपूर्ति और स्वास्थ्य सेवा",
        title_mr: "वैद्यकीय पुरवठा आणि स्वास्थ्य सेवा",
        description_en: "Essential medical equipment and healthcare support for our elderly residents",
        description_hi: "हमारे बुजुर्ग निवासियों के लिए आवश्यक चिकित्सा उपकरण",
        description_mr: "आमच्या वृद्ध रहिवाश्यांसाठी आवश्यक वैद्यकीय उपकरणे",
        priority: "high",
        is_active: true
      },
      {
        id: 2,
        title_en: "Nutritious Food & Meals",
        title_hi: "पौष्टिक खाद्य और भोजन",
        title_mr: "पौष्टिक अन्न आणि जेवण",
        description_en: "Healthy and balanced meals for proper nutrition of residents",
        description_hi: "निवासियों के उचित पोषण के लिए स्वस्थ और संतुलित भोजन",
        description_mr: "रहिवाश्यांच्या योग्य पोषणासाठी आरोग्यकर आणि संतुलित जेवण",
        priority: "high",
        is_active: true
      },
      {
        id: 3,
        title_en: "Comfort & Daily Necessities",
        title_hi: "आराम और दैनिक आवश्यकताएं",
        title_mr: "आराम आणि दैनंदिन आवश्यकताएं",
        description_en: "Bedding, clothing, and personal hygiene items for residents",
        description_hi: "निवासियों के लिए बिस्तर, कपड़े और व्यक्तिगत स्वच्छता वस्तुएं",
        description_mr: "रहिवाश्यांसाठी पलंग, कपडे आणि व्यक्तिगत स्वच्छता वस्तू",
        priority: "medium",
        is_active: true
      }
    ];
    let filtered = mockNeeds.filter(need =>
      Object.keys(conditions).every(key => need[key] === conditions[key])
    );
    if (sortBy === '-priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
    }
    return filtered.slice(0, limit).map(need => new Need(need));
  }
}
export { Need };
