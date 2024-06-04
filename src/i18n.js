import { createI18n } from 'vue-i18n'; // Import từ Vue I18n

const localeMessages = {
    en: {
        home: {
            slogan: "A different experience at the airport",
            enter_guests: "Enter number of guests",
            group: "Group",
            service: "Service",
            name: "Name",
            full_name: "Full name",
            autofill_passport_photo: "Autofill if providing the passport photo",
            passport_number: "Passport Number",
            nationality: "Nationality",
            service_time: "Service Time",
            flight_number: "Flight Number",
            airport: "Airport",
            service_location: "Where the service will be held",
            email: "Email",
            international_airport: "International Airport",
            phone_number: "Phone Number",
            note: "Note",
            select_airport: "Please airt",
            upload_documents: "Upload Documents",
            upload_passport_here: "Upload passport at here",
            upload_visa_here: "Upload visa at here",
            upload_portrait_here: "Upload portrait at here",
            mandatory_marks: "Marks field are mandatory to fill up",
            button: "Submit",
        },
        services: {
            VIP_Pick_up: "VIP Pick-up",
            VIP_See_off: "VIP See-off",
            Business_Pick_up: "Business Pick-up",
            Business_See_off: "Business See-off",
            Immigration_Only_Pick_up: "Immigration Only Pick-up",
            Immigration_Only_See_off: "Immigration Only See-off"
          },
        options:{
            change_visa: "Change Visa",
            exchange_currency: "Exchange Currency",
            buy_sim_card: "Buy SIM Card",
            wheelchair_service: "Wheelchair Service",
            poor_health_support: "Poor Health Mobility",
            customs_declaration_support: "Customs Declaration Assistance",
            luggage_assistance: "Excess Baggage",
            see_off_choose_staff: "Choose Staff:"
        }
    },
          
    vi: {
        home: {
            slogan: "Một trải nghiệm khác biệt tại sân bay",
            enter_guests: "Nhập số lượng khách",
            group: "Nhóm",
            service: "Dịch vụ",
            name: "Tên",
            full_name: "Tên đầy đủ",
            autofill_passport_photo: "Tự động điền nếu cung cấp ảnh hộ chiếu",
            passport_number: "Số hộ chiếu",
            nationality: "Quốc tịch",
            service_time: "Thời gian dịch vụ",
            flight_number: "Số hiệu chuyến bay",
            airport: "Sân bay",
            service_location: "Nơi diễn ra dịch vụ",
            email: "Email",
            phone_number: "Số điện thoại",
            note: "Ghi chú",
            international_airport: "Sân bay quốc tế",
            select_airport: "Chọn sân bay",
            service_here: "Nơi dịch vụ sẽ được tổ chức",
            upload_documents: "Tải tài liệu lên",
            upload_passport_here: "Tải hộ chiếu lên ở đây",
            upload_visa_here: "Tải visa lên ở đây",
            upload_portrait_here: "Tải ảnh chân dung lên ở đây",
            mandatory_marks: "Các mục đánh dấu là bắt buộc điền",
            submit: "Gửi",
        },
        services: {
            VIP_Pick_up: "Quốc Nội",
            VIP_See_off: "Tiễn VIP",
            Business_Pick_up: "Đón Doanh Nhân",
            Business_See_off: "Tiễn Doanh Nhân",
            Immigration_Only_Pick_up: "Đón Chỉ Nhập Cảnh",
            Immigration_Only_See_off: "Tiễn Chỉ Nhập Cảnh"
          },
        options: {
            change_visa: "Đổi Visa",
            exchange_currency: "Đổi Tiền",
            buy_sim_card: "Mua Sim-Card",
            wheelchair_service: "Dịch Vụ Xe Lăn",
            poor_health_support: "Sức Khỏe Kém Khó Di Chuyển",
            customs_declaration_support: "Hỗ Trợ Khai Báo Hải Quan",
            luggage_assistance: "Nhiều Hành Lý",
            see_off_choose_staff: "Chọn Nhân Viên Đón-Tiễn"
        }
    },

    zh: {
        home: {
            slogan: "机场的不同体验",
            enter_guests: "输入客人数量",
            group: "群组",
            service: "服务",
            name: "姓名",
            full_name: "全名",
            autofill_passport_photo: "提供护照照片时自动填充",
            passport_number: "护照号码",
            nationality: "国籍",
            service_time: "服务时间",
            flight_number: "航班号码",
            airport: "机场",
            service_location: "服务地点",
            email: "邮箱",
            phone_number: "电话号码",
            note: "备注",
            international_airport: "国际机场",
            select_airport: "选择机场",
            service_here: "举行仪式的地点",
            upload_documents: "上传文件",
            upload_passport_here: "在此上传护照",
            upload_visa_here: "在此上传签证",
            upload_portrait_here: "在此上传肖像",
            mandatory_marks: "标记字段为必填项",
            submit: "提交"
        },
        services: {
            VIP_Pick_up: "VIP接送",
            VIP_See_off: "VIP送行",
            Business_Pick_up: "商务接送",
            Business_See_off: "商务送行",
            Immigration_Only_Pick_up: "仅限入境接送",
            Immigration_Only_See_off: "仅限入境送行"
          },
          options: {
            change_visa: "更改签证",
            exchange_currency: "兑换货币",
            buy_sim_card: "购买SIM卡",
            wheelchair_service: "轮椅服务",
            poor_health_support: "行动不便",
            customs_declaration_support: "海关申报帮助",
            luggage_assistance: "行李超额",
            see_off_choose_staff: "选择员工"
        }
    },
    ko: {
        home: {
            slogan: "공항에서의 색다른 경험",
            enter_guests: "손님 수를 입력하세요",
            group: "그룹",
            service: "서비스",
            name: "십",
            full_name: "이름",
            autofill_passport_photo: "여권 사진 제공 시 자동 완성",
            passport_number: "여권 번호",
            nationality: "국적",
            service_time: "서비스 시간",
            flight_number: "항공편 번호",
            airport: "공항",
            service_location: "서비스가 진행되는 곳",
            email: "이메일",
            phone_number: "전화 번호",
            note: "메모",
            international_airport: "국제 공항",
            select_airport: "공항 선택",
            service_here: "서비스가 진행되는 곳",
            upload_documents: "문서 업로드",
            upload_passport_here: "여기에 여권을 업로드하세요.",
            upload_visa_here: "여기에 비자를 업로드하세요.",
            upload_portrait_here: "여기에 초상화를 업로드하세요.",
            mandatory_marks: "마크 필드는 필수로 작성해야 합니다.",
            submit: "제출하다",
        },
        services: {
            VIP_Pick_up: "VIP 픽업",
            VIP_See_off: "VIP 배웅",
            Business_Pick_up: "비즈니스 픽업",
            Business_See_off: "비즈니스 배웅",
            Immigration_Only_Pick_up: "입국 전용 픽업",
            Immigration_Only_See_off: "입국 전용 배웅"
          },
          options: {
            change_visa: "비자 변경",
            exchange_currency: "화폐 교환",
            buy_sim_card: "SIM 카드 구매",
            wheelchair_service: "휠체어 서비스",
            poor_health_support: "이동이 어려움",
            customs_declaration_support: "세관 신고 지원",
            luggage_assistance: "과잉 수하물",
            see_off_choose_staff: "직원 선택"
        }
    }
};

const i18n = createI18n({
    legacy: false, // Sử dụng chế độ hiện đại
    locale: 'en',
    fallbackLocale: 'en',
    messages: localeMessages
});

export default i18n;
