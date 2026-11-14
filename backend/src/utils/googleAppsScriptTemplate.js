export const getGoogleAppsScriptCode = (webhookUrl = 'http://localhost:5001/api/webhooks/google-form') => {
  return `/**
 * GOOGLE APPS SCRIPT CHO GOOGLE FORM
 * Hướng dẫn cài đặt:
 * 1. Mở Google Form bài kiểm tra của bạn
 * 2. Nhấp vào dấu 3 chấm góc trên bên phải -> Chọn "Trình chỉnh sửa tập lệnh" (Apps Script)
 * 3. Dán toàn bộ đoạn code dưới đây vào và thay đổi WEBHOOK_URL (nếu dùng link deploy thật)
 * 4. Bấm Lưu (Save icon)
 * 5. Chọn menu bên trái "Kích hoạt" (Triggers / Biểu tượng đồng hồ) -> Bấm "Thêm bộ kích hoạt" (Add Trigger):
 *    - Chọn hàm để chạy: onFormSubmitTrigger
 *    - Nguồn sự kiện: Từ biểu mẫu (From form)
 *    - Loại sự kiện: Khi gửi biểu mẫu (On form submit)
 * 6. Bấm Lưu và cấp quyền cho script.
 */

const WEBHOOK_URL = "${webhookUrl}";
const FORM_ID = "DAY_1_FORM"; // Đổi thành mã form tương ứng (ví dụ: DAY_1_FORM, DAY_2_FORM)

function onFormSubmitTrigger(e) {
  try {
    const form = FormApp.getActiveForm();
    const responses = form.getResponses();
    const latestResponse = responses[responses.length - 1];
    
    // Lấy email người nộp
    const studentEmail = latestResponse.getRespondentEmail();
    
    // Tính điểm số từ Google Form Quiz
    const itemResponses = latestResponse.getGradableItemResponses();
    let totalScore = 0;
    let maxScore = 0;
    
    for (let i = 0; i < itemResponses.length; i++) {
      const itemResponse = itemResponses[i];
      const score = itemResponse.getScore();
      if (score !== null && score !== undefined) {
        totalScore += score;
      }
      const item = itemResponse.getItem();
      // Lấy điểm tối đa của câu hỏi nếu có
      try {
        const itemPoints = item.asMultipleChoiceItem().getPoints();
        maxScore += itemPoints || 1;
      } catch (err) {
        maxScore += 1;
      }
    }
    
    // Nếu form chưa cấu hình quiz points thì mặc định thang 10
    if (maxScore === 0) maxScore = 10;
    
    const payload = {
      formId: FORM_ID,
      formTitle: form.getTitle(),
      studentEmail: studentEmail,
      score: totalScore,
      maxScore: maxScore,
      submittedAt: new Date().toISOString()
    };
    
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    Logger.log("Webhook response: " + response.getContentText());
  } catch (err) {
    Logger.log("Error sending webhook: " + err.toString());
  }
}
`;
};
