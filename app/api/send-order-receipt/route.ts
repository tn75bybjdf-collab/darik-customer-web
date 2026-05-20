import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, Session, User } from '@supabase/supabase-js';
import * as Location from 'expo-location';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ImageSourcePropType,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const HERO_BANNER_WIDTH = Dimensions.get('window').width - 36;

const DARIK_MAP_LATITUDE_DELTA = 0.006;
const DARIK_MAP_LONGITUDE_DELTA = 0.006;


const supabaseUrl = 'https://aarpjcfsnlasclxefdqj.supabase.co';
const supabaseAnonKey = 'sb_publishable_NWoe1kqAaGr4Oxpjb7Y_ng_lQ7MjZH4';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

const CUSTOMER_REMEMBER_KEY = 'darik_customer_remember_me';
const DARIK_CUSTOMER_LANGUAGE_KEY = 'darik_customer_language_v1';
type AppLanguage = 'en' | 'ar';

// L257 customer app Arabic pass: all new customer-facing text should go through DARIK_TRANSLATIONS.
const DARIK_TRANSLATIONS = {
  switchToArabic: { en: 'العربية', ar: 'العربية' },
  switchToEnglish: { en: 'English', ar: 'English' },
  loading: { en: 'Loading', ar: 'جارٍ التحميل' },
  welcomeToDarik: { en: 'Welcome to Darik', ar: 'أهلاً بك في Darik' },
  authSubtitle: {
    en: 'Sign in once and order essentials fast around Amman.',
    ar: 'سجّل دخولك مرة واحدة واطلب احتياجاتك بسرعة داخل عمّان.',
  },
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  signUp: { en: 'Sign Up', ar: 'إنشاء حساب' },
  customerLogin: { en: 'Customer Login', ar: 'دخول العميل' },
  createCustomerAccount: { en: 'Create Customer Account', ar: 'إنشاء حساب عميل' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  password: { en: 'Password', ar: 'كلمة المرور' },
  fullName: { en: 'Full Name', ar: 'الاسم الكامل' },
  phoneNumber: { en: 'Phone Number', ar: 'رقم الهاتف' },
  customerEmailPlaceholder: { en: 'customer@example.com', ar: 'customer@example.com' },
  passwordPlaceholder: { en: 'Password', ar: 'كلمة المرور' },
  minimumPasswordPlaceholder: { en: 'Minimum 6 characters', ar: '6 أحرف على الأقل' },
  namePlaceholder: { en: 'Example: Ahmad Saleh', ar: 'مثال: أحمد صالح' },
  phonePlaceholder: { en: 'Example: 0790000000', ar: 'مثال: 0790000000' },
  rememberMe: { en: 'Remember me', ar: 'تذكرني' },
  rememberMeSubtitle: { en: 'Stay logged in on this phone.', ar: 'ابقَ مسجلاً على هذا الهاتف.' },
  pleaseWait: { en: 'Please wait...', ar: 'يرجى الانتظار...' },
  createAccount: { en: 'Create Account', ar: 'إنشاء الحساب' },
  cart: { en: 'Cart', ar: 'السلة' },
  orderHistory: { en: 'Order History', ar: 'سجل الطلبات' },
  support: { en: 'Support', ar: 'الدعم' },
  settings: { en: 'Settings', ar: 'الإعدادات' },
  otherOptions: { en: 'Other Options', ar: 'خيارات أخرى' },
  changeLanguage: { en: 'Change Language', ar: 'تغيير اللغة' },
  seeOrderHistory: { en: 'See Order History', ar: 'عرض سجل الطلبات' },
  contactSupport: { en: 'Contact Support', ar: 'التواصل مع الدعم' },
  changeYourPassword: { en: 'Change Your Password', ar: 'تغيير كلمة المرور' },
  customerSettings: { en: 'Customer Settings', ar: 'إعدادات العميل' },
  accountInformation: { en: 'Account Information', ar: 'معلومات الحساب' },
  customerNumber: { en: 'Customer Number', ar: 'رقم العميل' },
  currentLanguage: { en: 'Current Language', ar: 'اللغة الحالية' },
  english: { en: 'English', ar: 'الإنجليزية' },
  arabic: { en: 'Arabic', ar: 'العربية' },
  menuSubtitle: { en: 'Quick access to your Darik account tools.', ar: 'وصول سريع لأدوات حسابك في Darik.' },
  settingsSubtitle: { en: 'Your customer account details.', ar: 'تفاصيل حسابك كعميل.' },
  newPassword: { en: 'New Password', ar: 'كلمة المرور الجديدة' },
  confirmNewPassword: { en: 'Confirm New Password', ar: 'تأكيد كلمة المرور الجديدة' },
  passwordChangeHelp: { en: 'Use at least 6 characters. You will stay logged in after updating.', ar: 'استخدم 6 أحرف على الأقل. ستبقى مسجلاً بعد التحديث.' },
  updatePassword: { en: 'Update Password', ar: 'تحديث كلمة المرور' },
  updatingPassword: { en: 'Updating...', ar: 'جاري التحديث...' },
  passwordTooShort: { en: 'Password must be at least 6 characters.', ar: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' },
  passwordsDoNotMatch: { en: 'Passwords do not match.', ar: 'كلمتا المرور غير متطابقتين.' },
  passwordUpdated: { en: 'Password updated successfully.', ar: 'تم تحديث كلمة المرور بنجاح.' },

  deliveringAroundAmman: { en: 'Delivering around Amman', ar: 'التوصيل داخل عمّان' },
  deliveryPromiseShort: { en: 'Free tomorrow. 2 JOD today.', ar: 'مجاناً بكرة. 2 دينار اليوم.' },
  liveStockWarehouse: {
    en: 'Live stock from Darik warehouse and verified local retailers.',
    ar: 'مخزون مباشر من مستودع Darik وتجار محليين موثّقين.',
  },
  darikVerified: { en: 'Darik Verified', ar: 'موثّق من Darik' },
  liveStock: { en: 'Live Stock', ar: 'مخزون مباشر' },
  warehouseChecked: { en: 'Warehouse Checked', ar: 'مفحوص في المستودع' },
  secureCheckout: { en: 'Secure Checkout', ar: 'دفع آمن' },
  signedInAs: { en: 'Signed in as', ar: 'مسجّل الدخول باسم' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },
  darikCreditBalance: { en: 'Darik Credit Balance', ar: 'رصيد Darik' },
  creditAutoApplied: {
    en: 'Return credits are automatically applied to your next checkout.',
    ar: 'رصيد المرتجعات يُستخدم تلقائياً في طلبك القادم.',
  },
  searchPlaceholder: {
    en: 'Search Darik essentials, cosmetics, baby, pets...',
    ar: 'ابحث في Darik عن الشواحن، مستحضرات التجميل، الأطفال، والحيوانات الأليفة...',
  },
  sponsoredStores: { en: 'SPONSORED STORES', ar: 'متاجر مميزة' },
  clickToShop: { en: 'CLICK TO SHOP', ar: 'اضغط للتسوق' },
  freeNextDay: { en: 'Free Next-Day', ar: 'توصيل مجاني بكرة' },
  freeNextDayText: { en: 'Wait until tomorrow and pay 0.00 JOD delivery.', ar: 'استلم بكرة وادفع 0.00 دينار للتوصيل.' },
  expressToday: { en: 'Express Today', ar: 'توصيل سريع اليوم' },
  expressTodayText: { en: 'Pay 2.00 JOD for urgent delivery under 2 hours.', ar: 'ادفع 2.00 دينار للتوصيل العاجل خلال أقل من ساعتين.' },
  cartSummary: { en: 'Cart Summary', ar: 'ملخص السلة' },
  tapToViewCart: { en: 'Tap to view cart', ar: 'اضغط لعرض السلة' },
  categories: { en: 'Categories', ar: 'الأقسام' },
  clothingDepartment: { en: 'Clothing Department', ar: 'قسم الملابس' },
  clothingType: { en: 'Clothing Type', ar: 'نوع الملابس' },
  chooseClothingDepartment: { en: 'Choose Men, Women, Boy, Girl, or Baby first.', ar: 'اختر أولاً: رجال، نساء، ولد، بنت، أو بيبي.' },
  clothingFilterHelp: { en: 'Pick a department, then narrow down by item type.', ar: 'اختر القسم ثم حدد نوع القطعة.' },
  subcategories: { en: 'Subcategories', ar: 'الأقسام الفرعية' },
  subcategoryFilterHelp: { en: 'Narrow this category by exact item type.', ar: 'صفّي هذا القسم حسب نوع المنتج.' },

  total: { en: 'total', ar: 'المجموع' },
  all: { en: 'ALL', ar: 'الكل' },
  browseEveryLiveItem: { en: 'Browse every live item', ar: 'تصفح كل المنتجات المتاحة' },
  allProducts: { en: 'All Products', ar: 'كل المنتجات' },
  liveMarket: { en: 'LIVE MARKET', ar: 'سوق مباشر' },
  fastTag: { en: 'Fast', ar: 'سريع' },
  verifiedTag: { en: 'Verified', ar: 'موثّق' },
  browseNow: { en: 'Browse now', ar: 'تصفح الآن' },
  yourCartIsEmpty: { en: 'Your cart is empty', ar: 'سلتك فارغة' },
  addProductsToStart: { en: 'Add products to start an order.', ar: 'أضف منتجات حتى تبدأ الطلب.' },
  itemsInYourCart: { en: 'Items in your cart', ar: 'المنتجات في السلة' },
  reviewQuantities: { en: 'Review quantities before checkout.', ar: 'راجع الكميات قبل إتمام الطلب.' },
  close: { en: 'Close', ar: 'إغلاق' },
  customerDetails: { en: 'Customer Details', ar: 'بيانات العميل' },
  deliveryLocation: { en: 'Delivery Location', ar: 'موقع التوصيل' },
  cashOnDelivery: { en: 'Cash on Delivery', ar: 'الدفع عند الاستلام' },
  chooseSize: { en: 'Choose size', ar: 'اختر المقاس' },
  sizesUnavailable: { en: 'Sizes are loading or not available for this item yet.', ar: 'المقاسات قيد التحميل أو غير متوفرة لهذا المنتج حالياً.' },
  add: { en: 'Add', ar: 'إضافة' },
  itemPrice: { en: 'Item price', ar: 'سعر المنتج' },
  addedToCart: { en: 'Added to cart', ar: 'تمت الإضافة إلى السلة' },
  viewCart: { en: 'View Cart', ar: 'عرض السلة' },
  savedForLater: { en: 'Saved for Later', ar: 'محفوظ لوقت لاحق' },
  clear: { en: 'Clear', ar: 'مسح' },
  moveToCart: { en: 'Move to cart', ar: 'نقل إلى السلة' },
  remove: { en: 'Remove', ar: 'حذف' },
  promo: { en: 'Promo', ar: 'عرض' },
  darikLiveMarketplace: { en: 'Best Sellers', ar: 'الأكثر مبيعاً' },
  showingProductsFrom: { en: 'Showing products from', ar: 'عرض منتجات من' },
  loadingProducts: { en: 'Loading products...', ar: 'جاري تحميل المنتجات...' },
  pullingProducts: { en: 'Pulling the first page of live Darik products.', ar: 'جاري تحميل أول صفحة من منتجات Darik المتاحة.' },
  noLiveProductsFound: { en: 'No live products found', ar: 'لا توجد منتجات متاحة حالياً' },
  freeExpress: { en: '🛵 FREE EXPRESS', ar: '🛵 توصيل سريع مجاني' },
  back: { en: 'Back', ar: 'رجوع' },
  sponsoredStore: { en: 'SPONSORED STORE', ar: 'متجر مميز' },
  liveItems: { en: 'Live Items', ar: 'منتجات متاحة' },
  fastDelivery: { en: 'Fast Delivery', ar: 'توصيل سريع' },
  verifiedStore: { en: 'Verified Store', ar: 'متجر موثّق' },
  noProductsLiveRightNow: { en: 'No products live right now', ar: 'لا توجد منتجات متاحة الآن' },
  checkBackSoon: { en: 'Check back soon for new products from this retailer.', ar: 'ارجع قريباً لمشاهدة منتجات جديدة من هذا التاجر.' },
  live: { en: 'Live', ar: 'متاح' },
  ratingReviews: { en: '4.8 rating | 28 reviews', ar: 'تقييم 4.8 | 28 مراجعة' },
  description: { en: 'Description', ar: 'الوصف' },
  reviews: { en: 'Reviews', ar: 'المراجعات' },
  verifiedBuyer: { en: 'Verified buyer', ar: 'عميل موثّق' },
  goodQualityDelivered: { en: 'Good quality and delivered quickly.', ar: 'جودة ممتازة وتم التوصيل بسرعة.' },
  chooseReplacementSize: { en: 'Choose Replacement Size', ar: 'اختر مقاس الاستبدال' },
  loadingSizes: { en: 'Loading sizes...', ar: 'جاري تحميل المقاسات...' },
  yourCart: { en: 'Your Cart', ar: 'سلتك' },
  saveForLater: { en: 'Save for later', ar: 'حفظ لوقت لاحق' },
  chooseDelivery: { en: 'Choose delivery', ar: 'اختر طريقة التوصيل' },
  chooseDeliverySubtitle: { en: 'Choose free tomorrow delivery or express delivery today. Retailer-sponsored express may be free.', ar: 'اختر توصيل مجاني بكرة أو توصيل سريع اليوم. قد يكون التوصيل السريع مجانياً إذا كان مدعوماً من التاجر.' },
  subtotal: { en: 'Subtotal', ar: 'المجموع الفرعي' },
  darikCreditFromReturns: { en: 'Darik Credit from returns', ar: 'رصيد Darik من المرتجعات' },
  grandTotal: { en: 'Total', ar: 'الإجمالي' },
  continueToCheckout: { en: 'Continue to Checkout', ar: 'المتابعة للدفع' },
  clearCart: { en: 'Clear Cart', ar: 'تفريغ السلة' },
  checkout: { en: 'Checkout', ar: 'إتمام الطلب' },
  checkoutSubtitle: { en: 'Confirm your delivery details', ar: 'تأكد من بيانات التوصيل' },
  manualGpsTitle: { en: 'Test Mode: Enter GPS Manually', ar: 'وضع التجربة: إدخال الموقع يدوياً' },
  manualGpsSubtitle: { en: 'Use this to test route ordering without standing at the delivery address.', ar: 'استخدمه لاختبار ترتيب المسار بدون التواجد في عنوان التوصيل.' },
  test: { en: 'TEST', ar: 'تجربة' },
  latitude: { en: 'Latitude', ar: 'خط العرض' },
  longitude: { en: 'Longitude', ar: 'خط الطول' },
  useManualGps: { en: 'Use Manual GPS for This Order', ar: 'استخدام الموقع اليدوي لهذا الطلب' },
  selectedDeliveryLocation: { en: 'Selected Delivery Location', ar: 'موقع التوصيل المحدد' },
  useCurrentLocation: { en: 'Use Current Location', ar: 'استخدم موقعي الحالي' },
  openInGoogleMaps: { en: 'Open This Location in Google Maps', ar: 'فتح هذا الموقع في خرائط Google' },
  confirmThisLocation: { en: 'Confirm This Location', ar: 'تأكيد هذا الموقع' },
  locationConfirmed: { en: 'Location confirmed', ar: 'تم تأكيد الموقع' },
  locationNotConfirmed: { en: 'Location not confirmed yet', ar: 'لم يتم تأكيد الموقع بعد' },
  checkMapThenConfirm: { en: 'Open Google Maps to check the pin, then come back and confirm this location.', ar: 'افتح خرائط Google للتأكد من الدبوس، ثم ارجع واضغط تأكيد الموقع.' },
  embeddedMapHelp: { en: 'Move the map or drag the pin if the location is not exact.', ar: 'حرّك الخريطة أو اسحب الدبوس إذا كان الموقع غير دقيق.' },
  tapMapToAdjustPin: { en: 'Tap anywhere on the map to move the pin.', ar: 'اضغط على أي مكان بالخريطة لتحريك الدبوس.' },
  confirmLocationRequiredTitle: { en: 'Confirm Location', ar: 'تأكيد الموقع' },
  confirmLocationRequiredText: { en: 'Open Google Maps if needed, then press Confirm This Location before continuing.', ar: 'افتح خرائط Google إذا لزم، ثم اضغط تأكيد هذا الموقع قبل المتابعة.' },
  locationConfirmedTitle: { en: 'Location Confirmed', ar: 'تم تأكيد الموقع' },
  locationConfirmedText: { en: 'This GPS location is confirmed for this order.', ar: 'تم تأكيد موقع GPS لهذا الطلب.' },
  noLocationSelected: { en: 'No location selected', ar: 'لم يتم اختيار موقع' },
  savedLocations: { en: 'Saved Locations', ar: 'المواقع المحفوظة' },
  refresh: { en: 'Refresh', ar: 'تحديث' },
  noSavedLocationsYet: { en: 'No saved locations yet', ar: 'لا توجد مواقع محفوظة بعد' },
  use: { en: 'Use', ar: 'استخدام' },
  extraAddressDetails: { en: 'Extra Address Details', ar: 'تفاصيل إضافية للعنوان' },
  extraAddressPlaceholder: { en: 'Building, street, floor, apartment, nearby landmark', ar: 'البناية، الشارع، الطابق، الشقة، علامة قريبة' },
  deliveryNote: { en: 'Delivery Note', ar: 'ملاحظة للتوصيل' },
  deliveryNotePlaceholder: { en: 'Optional: call when nearby', ar: 'اختياري: اتصل عند الاقتراب' },
  deliverySpeed: { en: 'Delivery Speed', ar: 'سرعة التوصيل' },
  driverThreeStopsAway: { en: 'Your driver is 3 stops away', ar: 'السائق على بُعد 3 توقفات' },
  driverTwoStopsAway: { en: 'Your driver is 2 stops away', ar: 'السائق على بُعد توقفين' },
  driverNextStop: { en: 'Your order is the next stop', ar: 'طلبك هو التوقف التالي' },
  driverDeliveredOrder: { en: 'Your order has been delivered', ar: 'تم توصيل طلبك' },
  liveDeliveryProgress: { en: 'Live delivery progress', ar: 'تقدم التوصيل المباشر' },
  deliveryCutoffText: { en: 'Choose how fast you want the order. Orders before 8 PM follow the today/tomorrow promise; after 8 PM, the ETA moves to the next available delivery day.', ar: 'اختر السرعة المناسبة لطلبك. الطلبات قبل الساعة 8 مساءً تتبع وعد اليوم/بكرة؛ بعد الساعة 8 مساءً ينتقل الموعد إلى أقرب يوم توصيل متاح.' },
  paymentMethod: { en: 'Payment Method', ar: 'طريقة الدفع' },
  orderReview: { en: 'Order Review', ar: 'مراجعة الطلب' },
  supportCenter: { en: 'Support Center', ar: 'مركز الدعم' },
  refreshSupport: { en: 'Refresh Support', ar: 'تحديث الدعم' },
  newSupportMessage: { en: 'New Support Message', ar: 'رسالة دعم جديدة' },
  removeRelatedOrder: { en: 'Remove related order', ar: 'إزالة الطلب المرتبط' },
  issueType: { en: 'Issue Type', ar: 'نوع المشكلة' },
  subject: { en: 'Subject', ar: 'الموضوع' },
  deliveryProblemPlaceholder: { en: 'Example: Delivery problem', ar: 'مثال: مشكلة في التوصيل' },
  message: { en: 'Message', ar: 'الرسالة' },
  supportMessagePlaceholder: { en: 'Type the details for Darik support...', ar: 'اكتب التفاصيل لدعم Darik...' },
  mySupportTickets: { en: 'My Support Tickets', ar: 'تذاكر الدعم الخاصة بي' },
  noSupportTicketsYet: { en: 'No support tickets yet', ar: 'لا توجد تذاكر دعم بعد' },
  replySupportPlaceholder: { en: 'Reply to Darik support...', ar: 'اكتب رداً لدعم Darik...' },
  ticketResolved: { en: 'This support ticket is resolved.', ar: 'تم حل تذكرة الدعم هذه.' },
  darikOrders: { en: 'DARIK ORDERS', ar: 'طلبات Darik' },
  darikPromise: { en: 'DARIK PROMISE', ar: 'وعد Darik' },
  shopWithConfidence: { en: 'Shop with confidence.', ar: 'تسوّق بثقة.' },
  creditReturnAllowance: { en: 'Credit return allowance', ar: 'رصيد للمرتجعات المقبولة' },
  returnWindow: { en: '24-hour return window', ar: 'نافذة إرجاع خلال 24 ساعة' },
  freeDefectiveReplacement: { en: 'Free defective replacement', ar: 'استبدال مجاني للمنتج التالف' },
  refreshOrders: { en: 'Refresh Orders', ar: 'تحديث الطلبات' },
  noOrdersYet: { en: 'No orders yet', ar: 'لا توجد طلبات بعد' },
  replacementExchangeDelivery: { en: 'Replacement exchange delivery', ar: 'توصيل منتج الاستبدال' },
  cancellationPendingReview: { en: 'Cancellation request pending admin review', ar: 'طلب الإلغاء بانتظار مراجعة الإدارة' },
  requestCancellation: { en: 'Request Cancellation', ar: 'طلب الإلغاء' },
  darikPromiseReturnWindow: { en: 'Darik Promise return window', ar: 'نافذة الإرجاع ضمن وعد Darik' },
  contactSupportOrder: { en: 'Contact Darik Support About This Order', ar: 'التواصل مع دعم Darik بخصوص هذا الطلب' },
  orderCancelled: { en: 'Order Cancelled', ar: 'تم إلغاء الطلب' },
  seeDetails: { en: 'See Details', ar: 'عرض التفاصيل' },
  orderDetails: { en: 'ORDER DETAILS', ar: 'تفاصيل الطلب' },
  yourOrderPrepared: { en: 'Your order is being prepared', ar: 'طلبك قيد التجهيز' },
  items: { en: 'Items', ar: 'المنتجات' },
  paymentSummary: { en: 'Payment Summary', ar: 'ملخص الدفع' },
  deliveryOption: { en: 'Delivery option', ar: 'خيار التوصيل' },
  deliveryFee: { en: 'Delivery fee', ar: 'رسوم التوصيل' },
  deliveryDetails: { en: 'Delivery Details', ar: 'تفاصيل التوصيل' },
  nameThisLocation: { en: 'Name this location', ar: 'سمِّ هذا الموقع' },
  locationName: { en: 'Location Name', ar: 'اسم الموقع' },
  locationPlaceholder: { en: 'Example: Home', ar: 'مثال: البيت' },
  cancel: { en: 'Cancel', ar: 'إلغاء' },
  orderPlaced: { en: 'Order Placed', ar: 'تم إرسال الطلب' },
  yourDeliveryPin: { en: 'Your Delivery PIN', ar: 'رمز استلام الطلب' },
  done: { en: 'Done', ar: 'تم' },
  arabicTitleAvailable: { en: 'Arabic title available', ar: 'العنوان العربي متوفر' },
  sizeWord: { en: 'Size', ar: 'المقاس' },
  returnAlreadyRequested: { en: 'Return Already Requested', ar: 'تم طلب الإرجاع مسبقاً' },
  returnStatus: { en: 'Status', ar: 'الحالة' },
  returnWindowClosedTitle: { en: 'Return Window Closed', ar: 'انتهت مدة الإرجاع' },
  returnWindowClosedText: { en: 'The 24-hour Darik Promise return window has closed for this order.', ar: 'انتهت مدة الإرجاع خلال 24 ساعة ضمن وعد Darik لهذا الطلب.' },
  chooseReturnOption: { en: 'Choose Return Option', ar: 'اختر طريقة الإرجاع' },
  optionOneDarikCreditReturn: { en: 'Option 1: Darik Credit return', ar: 'الخيار 1: إرجاع كرصيد Darik' },
  grossCredit: { en: 'Gross credit', ar: 'الرصيد قبل الخصم' },
  pickupFeeDeductedFromCredit: { en: 'Pickup fee deducted from credit if applicable', ar: 'رسوم الاستلام تُخصم من الرصيد إذا كانت مطبقة' },
  estimatedCreditAfterDeduction: { en: 'Estimated credit after deduction', ar: 'الرصيد المتوقع بعد الخصم' },
  freeReturnsResetOn: { en: 'Free returns reset on', ar: 'يتجدد الإرجاع المجاني بتاريخ' },
  optionTwoExactReplacement: { en: 'Option 2: Exact same item replacement', ar: 'الخيار 2: استبدال بنفس المنتج تماماً' },
  exactReplacementExplanation: {
    en: 'Free defective exchange. No pickup fee. No monthly limit. If Darik approves, the exact replacement goes into next-day delivery and the driver collects the defective item at the door.',
    ar: 'استبدال مجاني إذا كان المنتج تالف. بدون رسوم استلام وبدون حد شهري. إذا وافقت Darik، يتم إرسال نفس المنتج مع توصيل اليوم التالي ويستلم السائق المنتج التالف من الباب.',
  },
  darikCreditButton: { en: 'Darik Credit', ar: 'رصيد Darik' },
  replaceItemButton: { en: 'Replace Item', ar: 'استبدال المنتج' },
  cannotCancelReturnTitle: { en: 'Cannot Cancel Return', ar: 'لا يمكن إلغاء الإرجاع' },
  cannotCancelReturnText: { en: 'This return can only be cancelled before Darik picks it up for inspection.', ar: 'يمكن إلغاء طلب الإرجاع فقط قبل أن تستلم Darik المنتج للفحص.' },
  cancelReturnRequestTitle: { en: 'Cancel Return Request?', ar: 'إلغاء طلب الإرجاع؟' },
  cancelReturnRequestText: { en: 'This will remove the return pickup from Darik operations. If it was already approved for pickup, it will disappear from the next-day pickup queue when possible.', ar: 'سيتم إزالة استلام المرتجع من عمليات Darik. إذا كان الطلب موافق عليه للاستلام، سيختفي من قائمة استلام اليوم التالي عند الإمكان.' },
  keepReturnButton: { en: 'Keep Return', ar: 'إبقاء الإرجاع' },
  cancelReturnButton: { en: 'Cancel Return', ar: 'إلغاء الإرجاع' },
  cancelReturnErrorTitle: { en: 'Cancel Return Error', ar: 'خطأ في إلغاء الإرجاع' },
  returnCancelledTitle: { en: 'Return Cancelled', ar: 'تم إلغاء الإرجاع' },
  orderWord: { en: 'Order', ar: 'الطلب' },
  statusWord: { en: 'Status', ar: 'الحالة' },
  openWord: { en: 'Open', ar: 'مفتوح' },
  closedWord: { en: 'Closed', ar: 'مغلق' },
  orderReceivedStatus: { en: 'Order Received', ar: 'تم استلام الطلب' },
  beingPreparedStatus: { en: 'Being Prepared', ar: 'قيد التجهيز' },
  outForDeliveryStatus: { en: 'Out for Delivery', ar: 'خرج للتوصيل' },
  deliveredStatus: { en: 'Delivered', ar: 'تم التوصيل' },
  cancelledStatus: { en: 'Cancelled', ar: 'ملغي' },
  returnWindowInlineHelp: { en: 'Request within 24 hours. Choose Darik Credit or a free exact replacement for defective items. Credit is issued only after pickup and full inspection approval.', ar: 'قدّم طلبك خلال 24 ساعة. اختر رصيد Darik أو استبدال مجاني لنفس المنتج إذا كان تالفاً. يتم إصدار الرصيد فقط بعد الاستلام وموافقة الفحص النهائي.' },
  creditReturnGrossValueLine: { en: 'Credit return gross value', ar: 'قيمة رصيد الإرجاع قبل الخصم' },
  exactReplacementFreeIfDefective: { en: 'Exact replacement is free if defective', ar: 'الاستبدال بنفس المنتج مجاني إذا كان المنتج تالفاً' },
  returnCancelledByYouText: { en: 'This return request was cancelled by you.', ar: 'لقد قمت بإلغاء طلب الإرجاع هذا.' },
  replacementSelectedApprovedText: { en: 'Replacement selected. If approved, Darik sends the exact same item next-day and collects the defective item at the door.', ar: 'تم اختيار الاستبدال. إذا وافقت Darik، سيتم إرسال نفس المنتج في اليوم التالي ويستلم السائق المنتج التالف من الباب.' },
  creditIssuedAfterInspectionText: { en: 'Credit issued only if Darik fully approves after inspection.', ar: 'يتم إصدار الرصيد فقط إذا وافقت Darik بالكامل بعد الفحص.' },
  optionWord: { en: 'Option', ar: 'الخيار' },
  freeReplacementExchangeText: { en: 'Free replacement exchange. No pickup fee. No monthly limit used.', ar: 'استبدال مجاني. بدون رسوم استلام وبدون احتساب حد شهري.' },
  replacementSizeWord: { en: 'Replacement size', ar: 'مقاس الاستبدال' },
  replacementStatusWord: { en: 'Replacement status', ar: 'حالة الاستبدال' },
  pickupFeeDeductedFromCreditShort: { en: 'Pickup fee deducted from credit', ar: 'رسوم الاستلام المخصومة من الرصيد' },
  netCredit: { en: 'Net credit', ar: 'صافي الرصيد' },
  cancelling: { en: 'Cancelling...', ar: 'جاري الإلغاء...' },
  cancelReturnRequestButton: { en: 'Cancel Return Request', ar: 'إلغاء طلب الإرجاع' },
  submitting: { en: 'Submitting...', ar: 'جاري الإرسال...' },
  returnReplaceThisItem: { en: 'Return / Replace This Item', ar: 'إرجاع / استبدال هذا المنتج' },
  orderPreparingPinLater: { en: 'Your order is being prepared. Delivery PIN will show here once it is out for delivery.', ar: 'طلبك قيد التجهيز. سيظهر رمز التسليم هنا بمجرد خروج الطلب للتوصيل.' },
  cancelledOn: { en: 'Cancelled', ar: 'تاريخ الإلغاء' },
  weWillShowDeliveryPin: { en: 'We will show your delivery PIN here once the order is out for delivery.', ar: 'سنُظهر رمز التسليم هنا بمجرد خروج الطلب للتوصيل.' },
  qtyWord: { en: 'Qty', ar: 'الكمية' },
  freeNextDayAppliedSavings: { en: 'Free Next-Day Delivery applied. You saved', ar: 'تم تطبيق التوصيل المجاني لليوم التالي. لقد وفّرت' },
  comparedToExpressDelivery: { en: 'compared to Express Delivery.', ar: 'مقارنة بالتوصيل السريع.' },
  paymentWord: { en: 'Payment', ar: 'الدفع' },
  noteWord: { en: 'Note', ar: 'ملاحظة' },
  notSet: { en: 'Not set', ar: 'غير محدد' },
  oneItem: { en: 'item', ar: 'منتج' },
  manyItems: { en: 'items', ar: 'منتجات' },
  deliveryWord: { en: 'Delivery', ar: 'التوصيل' },
  replacementExchangeHelpText: { en: 'Driver will deliver the exact replacement and collect the defective item at the door.', ar: 'سيقوم السائق بتوصيل نفس المنتج البديل واستلام المنتج التالف من الباب.' },
  nextDayDeliveryLabel: { en: 'Free Next-Day Delivery', ar: 'توصيل مجاني في اليوم التالي' },
  expressDeliveryLabel: { en: 'Express Delivery', ar: 'توصيل سريع' },
  deliveredTodayUnder2Hours: { en: 'Delivered today under 2 hours', ar: 'التوصيل اليوم خلال أقل من ساعتين' },
  after8PmDeliveredTomorrow: { en: 'After 8 PM cutoff — delivered tomorrow', ar: 'بعد الساعة 8 مساءً — التوصيل غداً' },
  deliveredTomorrow: { en: 'Delivered tomorrow', ar: 'التوصيل غداً' },
  after8PmDelivered: { en: 'After 8 PM cutoff — delivered', ar: 'بعد الساعة 8 مساءً — التوصيل' },
  exchangeDeliveryPin: { en: 'Exchange Delivery PIN', ar: 'رمز تسليم الاستبدال' },
  darikCreditDeliveryPin: { en: 'Darik Credit Delivery PIN', ar: 'رمز تسليم رصيد Darik' },
  deliveryPinLabel: { en: 'Delivery PIN', ar: 'رمز التسليم' },
  givePinReplacementHelp: { en: 'Give this PIN only when the driver delivers your replacement and collects the defective item.', ar: 'أعطِ هذا الرمز فقط عندما يسلّم السائق منتج الاستبدال ويستلم المنتج التالف.' },
  givePinDarikCreditHelp: { en: 'Give this PIN only when the driver is at your door with your Darik Credit order.', ar: 'أعطِ هذا الرمز فقط عندما يكون السائق عند بابك ومعه طلب رصيد Darik.' },
  givePinNormalHelp: { en: 'Only give this PIN to the Darik driver when the order is at your door.', ar: 'أعطِ هذا الرمز فقط لسائق Darik عندما يكون الطلب عند بابك.' },
  replacementCheckoutTitle: { en: 'Replacement Checkout', ar: 'إتمام استبدال المنتج' },
  replacementCheckoutSubtitle: { en: 'Confirm replacement size and pickup location before submitting to Darik.', ar: 'تأكد من مقاس الاستبدال وموقع الاستلام قبل إرسال الطلب إلى Darik.' },
  selectedReplacementItem: { en: 'Selected replacement item', ar: 'المنتج المختار للاستبدال' },
  selectedReplacementSize: { en: 'Selected replacement size', ar: 'مقاس الاستبدال المختار' },
  pickupLocation: { en: 'Pickup Location', ar: 'موقع الاستلام' },
  useOriginalOrNewPickup: { en: 'Use the original delivery address or choose a new pickup location, like work.', ar: 'استخدم عنوان الطلب الأصلي أو اختر موقع استلام جديد مثل الشغل.' },
  submitReplacementRequest: { en: 'Submit Replacement Request', ar: 'إرسال طلب الاستبدال' },
  confirmReplacementRequest: { en: 'Confirm Replacement Request', ar: 'تأكيد طلب الاستبدال' },
  replacementCheckoutMissingLocation: { en: 'Select the pickup GPS location before submitting the replacement request.', ar: 'اختر موقع الاستلام GPS قبل إرسال طلب الاستبدال.' },
  replacementCheckoutMissingAddress: { en: 'Add pickup address details before submitting the replacement request.', ar: 'أضف تفاصيل عنوان الاستلام قبل إرسال طلب الاستبدال.' },
  replacementPickupNoteLabel: { en: 'Replacement Pickup Note', ar: 'ملاحظة استلام الاستبدال' },
  currentPickupLocation: { en: 'Current Pickup Location', ar: 'موقع الاستلام الحالي' },
  selectPickupFromSavedLocations: { en: 'Select pickup from saved locations', ar: 'اختر موقع الاستلام من المواقع المحفوظة' },
  noReplacementSizeSelected: { en: 'No replacement size selected', ar: 'لم يتم اختيار مقاس للاستبدال' },
  originalOrderedSize: { en: 'Original ordered size', ar: 'المقاس الأصلي في الطلب' },
  labelWord: { en: 'Label', ar: 'الملصق' },
  availableWord: { en: 'available', ar: 'متوفر' },
  outWord: { en: 'Out', ar: 'غير متوفر' },
  selectWord: { en: 'Select', ar: 'اختيار' },
  replacementSizeHelp: { en: 'Pick the size you want Darik to send as the exact replacement. You will confirm pickup location next.', ar: 'اختر المقاس الذي تريد من Darik إرساله كاستبدال لنفس المنتج. بعدها ستؤكد موقع الاستلام.' },
  selected: { en: 'Selected', ar: 'مختار' },
  categoryWord: { en: 'Category', ar: 'قسم' },
  bestSellers: { en: 'Best Sellers', ar: 'الأكثر مبيعاً' },
  bestSellersIn: { en: 'Best Sellers in', ar: 'الأكثر مبيعاً في' },
  verifiedStockReady: { en: 'Verified stock ready for delivery', ar: 'مخزون موثّق وجاهز للتوصيل' },
  sortProducts: { en: 'Sort products', ar: 'ترتيب المنتجات' },
  priceLowHigh: { en: 'Price: Low to High', ar: 'السعر: من الأقل للأعلى' },
  priceHighLow: { en: 'Price: High to Low', ar: 'السعر: من الأعلى للأقل' },
  free: { en: 'FREE', ar: 'مجاني' },
  swipeToSeeMore: { en: 'Swipe to see more', ar: 'اسحب لعرض المزيد' },
  swipeDownToSeeMore: { en: 'Swipe down to see more', ar: 'اسحب للأسفل لعرض المزيد' },
  showingCategories: { en: 'Showing', ar: 'يتم عرض' },
  itemAdded: { en: 'item added', ar: 'منتج مضاف' },
  itemsAdded: { en: 'items added', ar: 'منتجات مضافة' },
  addApproveProductsHint: { en: 'Add or approve products from the retailer/admin apps.', ar: 'أضف أو وافق على المنتجات من تطبيق التاجر أو لوحة الإدارة.' },
  freeNextDayTrustTitle: { en: 'Free Next Day', ar: 'توصيل مجاني بكرة' },
  freeNextDayTrustSubtitle: { en: 'No-cost tomorrow delivery', ar: 'توصيل مجاني في اليوم التالي' },
  expressTrustTitle: { en: 'Express Delivery', ar: 'توصيل سريع' },
  expressTrustSubtitle: { en: 'Delivery in under 2 hours', ar: 'توصيل خلال أقل من ساعتين' },
  securePaymentTrustTitle: { en: 'Secure Payment', ar: 'دفع آمن' },
  securePaymentTrustSubtitle: { en: 'Safe & encrypted', ar: 'آمن ومحمي' },
  darikPromiseTrustTitle: { en: 'Darik Promise', ar: 'وعد Darik' },
  darikPromiseTrustSubtitle: { en: 'Trusted Darik protection', ar: 'حماية وثقة من Darik' },
  darikPromiseLongText: {
    en: 'Choose Darik Credit return or free exact replacement for defective items. Credit returns follow your monthly pickup allowance; replacement exchanges are free with no monthly limit.',
    ar: 'اختر رصيد Darik للمرتجع أو استبدال مجاني لنفس المنتج إذا كان تالفاً. مرتجعات الرصيد حسب عدد مرات الاستلام الشهرية، أما الاستبدال بسبب عيب فهو مجاني بدون حد شهري.',
  },
  freeReturnsRemainingThisMonth: { en: 'Free returns remaining this month', ar: 'مرات الإرجاع المجانية المتبقية هذا الشهر' },
  freeReturnsResetDate: { en: 'Free returns reset date', ar: 'تاريخ تجديد الإرجاع المجاني' },
  ordersScreenSubtitle: { en: 'Track active, delivered, and cancelled orders from Darik.', ar: 'تابع طلباتك النشطة والمسلّمة والملغية من Darik.' },
  ordersEmptyText: { en: 'Once you place an order, it will appear here through preparation, delivery, completion, or cancellation.', ar: 'بعد ما تعمل طلب، سيظهر هنا خلال التجهيز والتوصيل والإكمال أو الإلغاء.' },
  categoryClothing: { en: 'Clothing', ar: 'ملابس' },
  categoryFashion: { en: 'Fashion', ar: 'ملابس' },
  categoryBaby: { en: 'Baby', ar: 'أطفال' },
  categoryBabyKids: { en: 'Baby & Kids', ar: 'أطفال وبيبي' },
  categoryCosmetics: { en: 'Cosmetics', ar: 'مستحضرات تجميل' },
  categoryBeauty: { en: 'Beauty', ar: 'جمال وعناية' },
  categoryHomeGoods: { en: 'Home Goods', ar: 'مستلزمات البيت' },
  categorySchoolSupplies: { en: 'School Supplies', ar: 'مستلزمات مدرسية' },
  categoryPets: { en: 'Pets', ar: 'مستلزمات الحيوانات' },
  categoryTechAccessories: { en: 'Tech Accessories', ar: 'إكسسوارات إلكترونية' },
  categoryToolsHardware: { en: 'Tools & Hardware', ar: 'أدوات وعدد' },
  categoryCleaningProducts: { en: 'Cleaning Products', ar: 'مواد تنظيف' },
  categoryCarAccessories: { en: 'Car Accessories', ar: 'إكسسوارات سيارات' },
  categoryAutoEmergency: { en: 'Auto Emergency', ar: 'طوارئ السيارات' },
  categoryGifts: { en: 'Gifts', ar: 'هدايا' },
  categoryGamingAccessories: { en: 'Gaming Accessories', ar: 'إكسسوارات ألعاب' },
  categoryNetworking: { en: 'Networking', ar: 'شبكات وإنترنت' },
  categoryOfficeSupplies: { en: 'Office Supplies', ar: 'مستلزمات مكتبية' },
  categoryElectricalEssentials: { en: 'Electrical Essentials', ar: 'مستلزمات كهربائية' },
  categoryGardening: { en: 'Gardening', ar: 'مستلزمات الزراعة' },
  categoryToys: { en: 'Toys', ar: 'ألعاب' },
  categoryMicroSizesReady: { en: 'Sizes ready', ar: 'المقاسات جاهزة' },
  categoryMicroDailyCare: { en: 'Daily care', ar: 'احتياجات يومية' },
  categoryMicroBeautyPicks: { en: 'Beauty picks', ar: 'اختيارات الجمال' },
  categoryMicroPetEssentials: { en: 'Pet essentials', ar: 'احتياجات الحيوانات' },
  categoryMicroRoadReady: { en: 'Road ready', ar: 'جاهز للطريق' },
  categoryMicroLiveItems: { en: 'Live items', ar: 'منتجات متاحة' },
} as const;

type DarikTranslationKey = keyof typeof DARIK_TRANSLATIONS;
const DARIK_CART_STORAGE_KEY = 'darik_customer_persistent_cart_v1';
const DARIK_SAVED_FOR_LATER_STORAGE_KEY = 'darik_customer_saved_for_later_v1';
const darikHeaderLogo = require('../assets/images/darik_logo_final_v2.png');
const darikLoadingLogo = require('../assets/images/darik_logo_final_v3.png');
const categoryAutoEmergencyImage = require('../assets/images/category_auto_emergency.png');
const categoryElectricalEssentialsImage = require('../assets/images/category_electrical_essentials.png');
const categoryGamingAccessoriesImage = require('../assets/images/category_gaming_accessories.png');
const categoryNetworkingImage = require('../assets/images/category_networking.png');
const categoryOfficeSuppliesImage = require('../assets/images/category_office_supplies.png');
const categoryTechAccessoriesImage = require('../assets/images/category_tech_accessories.png');
const categoryToolsHardwareImage = require('../assets/images/category_tools_hardware.png');
const categoryClothingImage = require('../assets/images/category_clothing.png');
const categoryHomeGoodsImage = require('../assets/images/category_home_goods.png');
const categoryGardeningImage = require('../assets/images/category_gardening.png');
const categoryToysImage = require('../assets/images/category_toys.png');
const categoryBabyImage = require('../assets/images/category_baby.png');
const categoryCosmeticsImage = require('../assets/images/category_cosmetics.png');
const categoryPetsImage = require('../assets/images/category_pets.png');
const darikUnder2HoursBannerImage = require('../assets/images/darik_under_2_hours_banner.png');

type ClothingMarketplaceOption = {
  id: string;
  en: string;
  ar: string;
};

type MarketplaceCategorySubcategory = {
  id: string;
  category_code: string;
  category_name_match?: string | null;
  item_type_code: string;
  department_code: string;
  department_name_en: string;
  department_name_ar: string;
  item_type_name_en: string;
  item_type_name_ar: string;
  subcategory_name_en?: string | null;
  subcategory_name_ar?: string | null;
  requires_size?: boolean | null;
  is_one_size?: boolean | null;
  size_group_code?: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
};

const FALLBACK_FALLBACK_CLOTHING_DEPARTMENT_OPTIONS: ClothingMarketplaceOption[] = [
  { id: 'men', en: 'Men', ar: 'رجال' },
  { id: 'women', en: 'Women', ar: 'نساء' },
  { id: 'boy', en: 'Boy', ar: 'ولد' },
  { id: 'girl', en: 'Girl', ar: 'بنت' },
  { id: 'baby', en: 'Baby', ar: 'بيبي' },
];

const FALLBACK_FALLBACK_CLOTHING_ITEM_TYPE_OPTIONS: ClothingMarketplaceOption[] = [
  { id: 'shirts', en: 'Shirts', ar: 'قمصان' },
  { id: 'pants', en: 'Pants', ar: 'بناطيل' },
  { id: 'shoes', en: 'Shoes', ar: 'أحذية' },
  { id: 'full_outfits', en: 'Full Outfits', ar: 'أطقم كاملة' },
  { id: 'belts', en: 'Belts', ar: 'أحزمة' },
  { id: 'socks', en: 'Socks', ar: 'جرابات' },
  { id: 'hats', en: 'Hats', ar: 'قبعات' },
  { id: 'watches', en: 'Watches', ar: 'ساعات' },
  { id: 'sunglasses', en: 'Sunglasses', ar: 'نظارات شمسية' },
];

function normalizeMarketplaceCategoryCode(value: string | null | undefined) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function isClothingCategoryName(categoryName: string | null | undefined) {
  const cleanName = String(categoryName ?? '').trim().toLowerCase();

  return (
    cleanName.includes('clothing') ||
    cleanName.includes('clothes') ||
    cleanName.includes('fashion') ||
    cleanName.includes('apparel') ||
    cleanName.includes('ملابس')
  );
}



const CUSTOMER_VISIBLE_ORDER_STATUSES = [
  'placed',
  'accepted',
  'preparing',
  'packing',
  'ready_for_driver',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

const CANCELLED_ORDER_MESSAGE = 'Order cancelled by Darik.';

type Category = {
  id: string;
  name: string;
  official_marketplace_name_ar?: string | null;
  arabic_title_status?: string | null;
  arabic_title_admin_note?: string | null;
  arabic_title_reviewed_at?: string | null;
  arabic_title_reviewed_by?: string | null;
  description: string | null;
};

type Retailer = {
  id: string;
  business_name: string;
  retailer_number?: string | null;
  phone?: string | null;
  status?: string | null;
};

type CustomerAdBanner = {
  id: string;
  retailer_id: string | null;
  banner_status: string;
  sponsor_name: string;
  headline: string;
  subheadline: string | null;
  cta_label: string | null;
  banner_image_url: string | null;
  background_color: string | null;
  text_color: string | null;
  accent_color: string | null;
  sort_order: number | null;
  offer_type?: 'none' | 'free_delivery' | 'discount' | 'both' | string | null;
  free_delivery_min_order?: number | string | null;
  discount_percent?: number | string | null;
  discount_min_order?: number | string | null;
  offer_paid_by_retailer?: boolean | null;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at?: string | null;
};

type Product = {
  id: string;
  retailer_id: string;
  category_id: string | null;
  name: string;
  official_marketplace_name_ar?: string | null;
  arabic_title_status?: string | null;
  arabic_title_admin_note?: string | null;
  arabic_title_reviewed_at?: string | null;
  arabic_title_reviewed_by?: string | null;
  description: string | null;
  vendor_price: number;
  app_price: number;
  quantity_in_stock: number;
  product_status: string;
  photo_status: string;
  official_product_photo_url: string | null;
  official_product_thumbnail_url?: string | null;
  official_product_photo_url_2?: string | null;
  official_product_photo_url_3?: string | null;
  retailer_raw_photo_url: string | null;
  retailer_raw_photo_url_2?: string | null;
  retailer_raw_photo_url_3?: string | null;
  product_free_delivery_enabled?: boolean | null;
  product_free_delivery_min_order?: number | string | null;
  subcategory_name?: string | null;
  clothing_department?: string | null;
  clothing_item_type?: string | null;
  has_size_variants?: boolean | null;
  variant_summary?: string | null;
  best_seller_units_sold?: number | string | null;
  best_seller_revenue?: number | string | null;
  best_seller_order_count?: number | string | null;
  best_seller_latest_sale_at?: string | null;
  created_at?: string | null;
};

type ProductVariant = {
  id: string;
  product_id: string;
  retailer_id?: string | null;
  size_label: string;
  size_sort_order?: number | string | null;
  variant_sku?: string | null;
  quantity_in_stock: number | string;
  warehouse_location?: string | null;
  variant_status?: string | null;
  expected_dropoff_quantity?: number | string | null;
  received_quantity?: number | string | null;
};

type CartItem = {
  id: string;
  productId?: string;
  productVariantId?: string | null;
  sizeLabel?: string | null;
  variantSku?: string | null;
  variantWarehouseLocation?: string | null;
  name: string;
  arabicName?: string | null;
  category: string;
  priceNumber: number;
  quantity: number;
  photoUrl?: string | null;
};

type PaymentMethod = 'Cash';
type DeliveryOptionType = 'next_day_free' | 'express_2hr';
type ProductSortOption = 'best_sellers' | 'price_low_high' | 'price_high_low';

type DeliveryLocation = {
  latitude: number;
  longitude: number;
};

type SavedCustomerLocation = {
  id: string;
  customer_id: string;
  label: string;
  latitude: number;
  longitude: number;
  address_details: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type CustomerProfile = {
  id: string;
  auth_user_id: string | null;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  customer_number?: string | null;
  darik_credit_balance?: number | string | null;
  account_restricted?: boolean | null;
  restriction_reason?: string | null;
  restriction_note?: string | null;
  restricted_at?: string | null;
  restricted_by_staff_name?: string | null;
};

type CustomerOrder = {
  id: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  payment_method: string | null;
  order_kind?: string | null;
  related_return_request_id?: string | null;
  admin_status_note?: string | null;
  payment_status?: string | null;
  payment_verification_status?: string | null;
  cliq_expected_amount?: number | string | null;
  cliq_payment_reference?: string | null;
  cliq_payment_screenshot_url?: string | null;
  cliq_payment_submitted_at?: string | null;
  cliq_payment_verified_at?: string | null;
  cliq_payment_verified_by?: string | null;
  cliq_payment_rejection_reason?: string | null;
  order_status: string;
  subtotal: number | null;
  delivery_fee: number | null;
  delivery_option?: DeliveryOptionType | string | null;
  delivery_label?: string | null;
  delivery_eta_label?: string | null;
  driver_stops_away_count?: number | string | null;
  driver_stops_away_label?: string | null;
  driver_stop_progress_stage?: string | null;
  driver_stop_progress_updated_at?: string | null;
  assigned_driver_type?: 'company' | 'contractor' | string | null;
  promotion_discount_total?: number | string | null;
  retailer_delivery_sponsor_amount?: number | string | null;
  promotion_note?: string | null;
  total: number | null;
  pre_credit_total?: number | string | null;
  darik_credit_applied_amount?: number | string | null;
  customer_amount_due?: number | string | null;
  delivery_pin?: string | null;
  delivery_address_details?: string | null;
  delivery_note?: string | null;
  delivered_at?: string | null;
  out_for_delivery_at?: string | null;
  cancelled_at?: string | null;
  cancelled_reason?: string | null;
  cancelled_by_staff_name?: string | null;
  archived_at?: string | null;
  archived_reason?: string | null;
  created_at: string;
};


type CustomerCancellationRequest = {
  id: string;
  order_id: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  order_number: string | null;
  request_status: 'pending' | 'approved' | 'denied' | 'cancelled_by_customer' | string;
  reason_category: string;
  reason_note: string | null;
  customer_message: string | null;
  requested_at: string;
  reviewed_at: string | null;
  reviewed_by_staff_name: string | null;
  admin_decision_note: string | null;
  created_at?: string | null;
};

type SupportThread = {
  id: string;
  sender_type: 'customer' | 'retailer' | 'driver' | string;
  sender_id: string | null;
  sender_name: string | null;
  sender_phone: string | null;
  sender_email: string | null;
  related_order_id: string | null;
  related_product_id: string | null;
  related_payout_id: string | null;
  issue_type: string;
  subject: string;
  status: string;
  priority: string;
  last_message_preview: string | null;
  last_message_at: string;
  resolved_at: string | null;
  resolved_by_staff_name: string | null;
  created_at: string;
  updated_at: string;
};

type SupportMessage = {
  id: string;
  thread_id: string;
  sender_role: 'customer' | 'retailer' | 'driver' | 'admin' | string;
  sender_id: string | null;
  sender_name: string | null;
  message_body: string;
  attachment_url: string | null;
  created_at: string;
};

type CustomerOrderItem = {
  id: string;
  order_id: string;
  product_id?: string | null;
  retailer_id?: string | null;
  product_variant_id?: string | null;
  size_label_snapshot?: string | null;
  variant_sku_snapshot?: string | null;
  variant_warehouse_location_snapshot?: string | null;
  product_subcategory_snapshot?: string | null;
  product_name: string;
  product_name_ar_snapshot?: string | null;
  quantity: number;
  app_price: number;
  line_total: number;
  created_at?: string | null;
};

type DarikReturnRequest = {
  id: string;
  customer_id: string;
  order_id: string;
  order_item_id: string;
  product_name: string;
  quantity: number;
  line_total: number | string | null;
  reason_category: string;
  customer_note: string | null;
  status: string;
  cancelled_at?: string | null;
  cancelled_by?: string | null;
  cancellation_reason?: string | null;
  pickup_fee_amount: number | string | null;
  free_pickup_applied: boolean | null;
  return_resolution_type?: 'credit_return' | 'exact_replacement' | string | null;
  return_fee_collection_method?: string | null;
  credit_pickup_fee_to_deduct_amount?: number | string | null;
  credit_pickup_fee_deducted_amount?: number | string | null;
  net_credit_issued_amount?: number | string | null;
  defective_exchange_free?: boolean | null;
  replacement_order_id?: string | null;
  replacement_order_status?: string | null;
  replacement_note?: string | null;
  replacement_product_variant_id?: string | null;
  replacement_size_label?: string | null;
  replacement_variant_sku?: string | null;
  original_product_variant_id?: string | null;
  original_size_label?: string | null;
  credit_issued_amount?: number | string | null;
  requested_at: string;
  updated_at?: string | null;
};

type OrderConfirmationSnapshot = {
  customerName: string;
  paymentMethod: PaymentMethod;
  deliveryLabel: string;
  deliveryEtaLabel: string;
  deliveryFee: number;
  promotionDiscountTotal: number;
  preCreditTotal: number;
  darikCreditAppliedAmount: number;
  total: number;
  deliveryLocation: DeliveryLocation | null;
};


const CUSTOMER_CANCELLATION_REASONS = [
  'Ordered by mistake',
  'Wrong item or quantity',
  'Delivery time no longer works',
  'Found it somewhere else',
  'Payment issue',
  'Changed my mind',
  'Other',
];

const CUSTOMER_SUPPORT_ISSUE_TYPES = [
  'Order issue',
  'Delivery issue',
  'Payment issue',
  'Cancel order',
  'Wrong item',
  'App problem',
  'Other',
];

const DARIK_MARKUP_RATE = 0.25;
const DARIK_MARKUP_MULTIPLIER = 1 + DARIK_MARKUP_RATE;
const DARIK_FULFILLMENT_FEE_RATE = 0.10;
const EXPRESS_DELIVERY_FEE = 2.5;
const FREE_NEXT_DAY_MIN_ORDER = 10;
const DELIVERY_CUTOFF_HOUR = 20;
const DARIK_WAREHOUSE_LATITUDE = 31.9539;
const DARIK_WAREHOUSE_LONGITUDE = 35.9106;
const EXPRESS_DELIVERY_RADIUS_KM = 5;
const NEXT_DAY_DELIVERY_RADIUS_KM = 10;
const QUIET_CUSTOMER_REFRESH_MS = 15 * 1000;
const QUIET_PRODUCT_STOCK_REFRESH_MS = 90 * 1000;
const QUIET_STATIC_MARKETPLACE_REFRESH_MS = 5 * 60 * 1000;
const PRODUCT_LIST_PAGE_SIZE = 24;
const BEST_SELLER_PRODUCT_POOL_SIZE = 200;
const BEST_SELLER_SECTION_PAGE_SIZE = 4;
const BEST_SELLER_INITIAL_CATEGORY_COUNT = 2;
const BEST_SELLER_CATEGORY_LOAD_MORE_COUNT = 2;
const CUSTOMER_GRID_IMAGE_MODE = 'thumbnail-first';

const DELIVERY_OPTIONS: Record<
  DeliveryOptionType,
  {
    value: DeliveryOptionType;
    label: string;
    shortLabel: string;
    etaLabel: string;
    fee: number;
    assignedDriverType: 'company' | 'contractor';
    description: string;
  }
> = {
  next_day_free: {
    value: 'next_day_free',
    label: 'Free Next-Day Delivery',
    shortLabel: 'Free Next-Day',
    etaLabel: 'Delivered tomorrow',
    fee: 0,
    assignedDriverType: 'company',
    description: 'Free for orders over 10 JOD with Darik company fleet routes.',
  },
  express_2hr: {
    value: 'express_2hr',
    label: 'Express Delivery',
    shortLabel: 'Express Under 2 Hours',
    etaLabel: 'Delivered under 2 hours',
    fee: EXPRESS_DELIVERY_FEE,
    assignedDriverType: 'contractor',
    description: '2.50 JOD express delivery for orders placed before 8 PM. Driver receives 2.00 JOD and Darik keeps 0.50 JOD express platform fee.',
  },
};

function getDeliveryOptionConfig(value: string | null | undefined) {
  if (value === 'express_2hr') return DELIVERY_OPTIONS.express_2hr;
  return DELIVERY_OPTIONS.next_day_free;
}

function addCalendarDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function isBeforeDeliveryCutoff(date: Date) {
  return date.getHours() < DELIVERY_CUTOFF_HOUR;
}

function getWeekdayName(date: Date) {
  return date.toLocaleDateString([], { weekday: 'long' });
}

function getDynamicDeliveryEtaLabel(option: DeliveryOptionType, now: Date) {
  const beforeCutoff = isBeforeDeliveryCutoff(now);

  if (option === 'express_2hr') {
    if (beforeCutoff) {
      return 'Delivered today under 2 hours';
    }

    const targetDate = addCalendarDays(now, 1);
    return `After 8 PM cutoff — delivered tomorrow (${getWeekdayName(targetDate)})`;
  }

  const targetDate = addCalendarDays(now, beforeCutoff ? 1 : 2);

  if (beforeCutoff) {
    return `Delivered tomorrow (${getWeekdayName(targetDate)})`;
  }

  return `After 8 PM cutoff — delivered ${getWeekdayName(targetDate)}`;
}

function getDynamicDeliveryDescription(option: DeliveryOptionType, now: Date) {
  const beforeCutoff = isBeforeDeliveryCutoff(now);

  if (option === 'express_2hr') {
    return beforeCutoff
      ? '2.00 JOD. Orders placed before 8 PM arrive today under 2 hours.'
      : '2.00 JOD. The 8 PM same-day cutoff passed, so this arrives tomorrow.';
  }

  return beforeCutoff
    ? 'Free for orders over 10.00 JOD. Orders placed before 8 PM arrive tomorrow.'
    : 'Free for orders over 10.00 JOD. After 8 PM, delivery moves to the day after tomorrow.';
}

function money(value: number | string | null | undefined) {
  return Number(value ?? 0).toFixed(2);
}

function toSafeNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getDarikCreditBalance(profile: CustomerProfile | null | undefined) {
  const balance = Number(profile?.darik_credit_balance ?? 0);
  if (!Number.isFinite(balance) || balance <= 0) return 0;
  return Number(balance.toFixed(2));
}

function roundMoney(value: number) {
  return Number(value.toFixed(2));
}

function getDistanceKm(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number
) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const deltaLatitude = toRadians(toLatitude - fromLatitude);
  const deltaLongitude = toRadians(toLongitude - fromLongitude);
  const fromLatRad = toRadians(fromLatitude);
  const toLatRad = toRadians(toLatitude);

  const a =
    Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
    Math.cos(fromLatRad) *
      Math.cos(toLatRad) *
      Math.sin(deltaLongitude / 2) *
      Math.sin(deltaLongitude / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function roundUpToNearestFivePiasters(value: number) {
  // Rounds up to the nearest 0.05 JOD.
  // Examples:
  // 3.13 -> 3.15
  // 3.16 -> 3.20
  // 3.20 -> 3.20
  const cents = Math.ceil((value * 100 - 0.000001) / 5) * 5;
  return roundMoney(cents / 100);
}

function getCustomerPriceFromRetailerPrice(retailerPrice: number | string | null | undefined) {
  return roundUpToNearestFivePiasters(Number(retailerPrice ?? 0) * DARIK_MARKUP_MULTIPLIER);
}

function getCustomerPrice(product: Product | null | undefined) {
  // Customer-facing price.
  // Retailer App already saves the marked-up customer price in products.app_price.
  // Example:
  // vendor_price = 8.00 JOD
  // app_price = 10.00 JOD or 12.50 JOD, depending on retailer/admin pricing setup.
  // Customer App must display app_price directly and must NOT add another 25% markup.
  return roundUpToNearestFivePiasters(Number(product?.app_price ?? 0));
}

function getRetailerBasePrice(product: Product | null | undefined) {
  // Retailer payout base.
  // Free express delivery sponsorship, discounts, and ad deductions come out of vendor_price,
  // not out of the customer-facing app_price.
  //
  // Example:
  // customer pays item price = 10.00 JOD
  // vendor_price = 8.00 JOD
  // free express delivery sponsor = 2.00 JOD
  // retailer_amount_owed = 8.00 - 2.00 = 6.00 JOD
  return roundMoney(Number(product?.vendor_price ?? 0));
}

function hasProductFreeShipping(product: Product | null | undefined) {
  return Boolean(product?.product_free_delivery_enabled);
}

function shortCode(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 4)
    .toUpperCase();
}

function normalizeCategoryName(name: string | null | undefined) {
  return String(name ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getDarikCategoryTranslationKey(name: string | null | undefined): DarikTranslationKey | null {
  const normalized = normalizeCategoryName(name);

  if (normalized === 'best sellers') return 'bestSellers';
  if (['clothing', 'clothes', 'apparel'].includes(normalized)) return 'categoryClothing';
  if (normalized === 'fashion') return 'categoryFashion';
  if (['baby', 'baby items', 'baby supplies', 'infant', 'infant supplies'].includes(normalized) || normalized.includes('baby')) return 'categoryBaby';
  if (normalized === 'baby kids' || normalized === 'baby and kids') return 'categoryBabyKids';
  if (['cosmetics', 'cosmetic'].includes(normalized) || normalized.includes('cosmetic')) return 'categoryCosmetics';
  if (['beauty', 'beauty supplies', 'skincare', 'skin care', 'makeup'].includes(normalized) || normalized.includes('beauty')) return 'categoryBeauty';
  if (['home goods', 'home essentials', 'household goods', 'household essentials'].includes(normalized)) return 'categoryHomeGoods';
  if (['school supplies', 'school essentials'].includes(normalized)) return 'categorySchoolSupplies';
  if (['pets', 'pet', 'pet items', 'pet supplies', 'animals'].includes(normalized) || normalized.includes('pet')) return 'categoryPets';
  if (['tech accessories', 'technology accessories', 'tech essentials'].includes(normalized)) return 'categoryTechAccessories';
  if (['tools hardware', 'tools and hardware', 'hardware tools', 'tools'].includes(normalized)) return 'categoryToolsHardware';
  if (['cleaning products', 'cleaning supplies', 'cleaning'].includes(normalized)) return 'categoryCleaningProducts';
  if (['car accessories', 'auto accessories'].includes(normalized)) return 'categoryCarAccessories';
  if (['auto emergency', 'auto emergencies', 'car emergency', 'car emergencies'].includes(normalized)) return 'categoryAutoEmergency';
  if (normalized === 'gifts' || normalized === 'gift') return 'categoryGifts';
  if (['gaming accessories', 'gaming', 'gaming gear'].includes(normalized)) return 'categoryGamingAccessories';
  if (['networking', 'network essentials', 'network accessories', 'networking accessories'].includes(normalized)) return 'categoryNetworking';
  if (['office supplies', 'office', 'office essentials'].includes(normalized)) return 'categoryOfficeSupplies';
  if (['electrical essentials', 'electrical accessories', 'electrical', 'electronics', 'small electronics'].includes(normalized) || normalized.includes('electric')) return 'categoryElectricalEssentials';
  if (['gardening', 'garden', 'garden supplies', 'gardening supplies'].includes(normalized)) return 'categoryGardening';
  if (['toys', 'toy', 'kids toys', 'children toys'].includes(normalized)) return 'categoryToys';

  return null;
}

function cleanLocationPart(value: string | null | undefined) {
  const text = String(value ?? '').trim();
  if (!text || text.toLowerCase() === 'unknown') return '';
  return text;
}

function buildReadableLocationName(address: Location.LocationGeocodedAddress | null | undefined) {
  if (!address) return '';

  const district = cleanLocationPart(address.district);
  const subregion = cleanLocationPart(address.subregion);
  const city = cleanLocationPart(address.city);
  const region = cleanLocationPart(address.region);
  const name = cleanLocationPart(address.name);
  const street = cleanLocationPart(address.street);

  // For Jordan testing, city/district is more useful than a random street/building name.
  // Examples we want to surface: Zarqa, Abdoun, Marka, Tabarbour, Marj Al Hamam.
  const firstChoice = district || city || subregion || region || name || street;
  const secondChoice = firstChoice === district ? city || subregion : '';

  if (firstChoice && secondChoice && firstChoice.toLowerCase() !== secondChoice.toLowerCase()) {
    return `${firstChoice}, ${secondChoice}`;
  }

  return firstChoice;
}

async function getReadableLocationLabel(latitude: number, longitude: number) {
  try {
    const results = await Location.reverseGeocodeAsync({ latitude, longitude });
    const readableName = buildReadableLocationName(results?.[0]);
    return readableName;
  } catch {
    return '';
  }
}

function buildGpsAddressLabel(latitude: number, longitude: number, readableName?: string) {
  const gpsText = `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  const cleanReadableName = cleanLocationPart(readableName);
  return cleanReadableName ? `${cleanReadableName} | ${gpsText}` : gpsText;
}

function getCategoryPreviewImage(name: string): ImageSourcePropType | null {
  const normalized = normalizeCategoryName(name);

  if (
    normalized === 'auto emergency' ||
    normalized === 'auto emergencies' ||
    normalized === 'car emergency' ||
    normalized === 'car emergencies'
  ) {
    return categoryAutoEmergencyImage;
  }

  if (
    normalized === 'electrical essentials' ||
    normalized === 'electrical accessories' ||
    normalized === 'electrical'
  ) {
    return categoryElectricalEssentialsImage;
  }

  if (
    normalized === 'gaming accessories' ||
    normalized === 'gaming' ||
    normalized === 'gaming gear'
  ) {
    return categoryGamingAccessoriesImage;
  }

  if (
    normalized === 'networking' ||
    normalized === 'network essentials' ||
    normalized === 'network accessories' ||
    normalized === 'networking accessories'
  ) {
    return categoryNetworkingImage;
  }

  if (
    normalized === 'office supplies' ||
    normalized === 'office' ||
    normalized === 'office essentials'
  ) {
    return categoryOfficeSuppliesImage;
  }

  if (
    normalized === 'tech accessories' ||
    normalized === 'technology accessories' ||
    normalized === 'tech essentials'
  ) {
    return categoryTechAccessoriesImage;
  }

  if (
    normalized === 'tools hardware' ||
    normalized === 'tools and hardware' ||
    normalized === 'hardware tools' ||
    normalized === 'tools'
  ) {
    return categoryToolsHardwareImage;
  }

  if (
    normalized === 'cosmetics' ||
    normalized === 'cosmetic' ||
    normalized === 'beauty' ||
    normalized === 'beauty supplies' ||
    normalized === 'skincare' ||
    normalized === 'skin care' ||
    normalized === 'makeup' ||
    normalized.includes('cosmetic') ||
    normalized.includes('beauty')
  ) {
    return categoryCosmeticsImage;
  }

  if (
    normalized === 'baby' ||
    normalized === 'baby items' ||
    normalized === 'baby supplies' ||
    normalized === 'infant' ||
    normalized === 'infant supplies' ||
    normalized.includes('baby')
  ) {
    return categoryBabyImage;
  }

  if (
    normalized === 'pets' ||
    normalized === 'pet' ||
    normalized === 'pet items' ||
    normalized === 'pet supplies' ||
    normalized === 'animals' ||
    normalized.includes('pet')
  ) {
    return categoryPetsImage;
  }

  if (
    normalized === 'clothing' ||
    normalized === 'clothes' ||
    normalized === 'fashion' ||
    normalized === 'apparel'
  ) {
    return categoryClothingImage;
  }

  if (
    normalized === 'home goods' ||
    normalized === 'home essentials' ||
    normalized === 'household goods' ||
    normalized === 'household essentials'
  ) {
    return categoryHomeGoodsImage;
  }

  if (
    normalized === 'gardening' ||
    normalized === 'garden' ||
    normalized === 'garden supplies' ||
    normalized === 'gardening supplies'
  ) {
    return categoryGardeningImage;
  }

  if (
    normalized === 'toys' ||
    normalized === 'toy' ||
    normalized === 'kids toys' ||
    normalized === 'children toys'
  ) {
    return categoryToysImage;
  }

  return null;
}

function getCategoryFallbackEmoji(name: string | null | undefined) {
  const normalized = normalizeCategoryName(name);

  if (
    normalized === 'cosmetics' ||
    normalized === 'cosmetic' ||
    normalized === 'beauty' ||
    normalized === 'beauty supplies' ||
    normalized === 'skincare' ||
    normalized === 'skin care' ||
    normalized === 'makeup' ||
    normalized.includes('cosmetic') ||
    normalized.includes('beauty')
  ) {
    return '💄';
  }

  if (
    normalized === 'baby' ||
    normalized === 'baby items' ||
    normalized === 'baby supplies' ||
    normalized === 'infant' ||
    normalized === 'infant supplies' ||
    normalized.includes('baby')
  ) {
    return '🍼';
  }

  if (
    normalized === 'pets' ||
    normalized === 'pet' ||
    normalized === 'pet items' ||
    normalized === 'pet supplies' ||
    normalized === 'animals' ||
    normalized.includes('pet')
  ) {
    return '🐾';
  }

  return '';
}


function sanitizeProductSearchForPostgrest(value: string | null | undefined) {
  return String(value ?? '')
    .trim()
    .replace(/[%,()]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 80);
}

function mergeProductRows(currentProducts: Product[], incomingProducts: Product[]) {
  const productMap = new Map<string, Product>();

  for (const product of currentProducts) {
    productMap.set(product.id, product);
  }

  for (const product of incomingProducts) {
    productMap.set(product.id, product);
  }

  return Array.from(productMap.values());
}


function getDarikCategorySortRank(categoryName: string | null | undefined) {
  const normalized = normalizeCategoryName(categoryName);

  if (
    normalized === 'clothing' ||
    normalized === 'clothes' ||
    normalized === 'fashion' ||
    normalized === 'apparel'
  ) {
    return 0;
  }

  if (
    normalized === 'baby' ||
    normalized === 'baby items' ||
    normalized === 'baby supplies' ||
    normalized === 'infant' ||
    normalized === 'infant supplies' ||
    normalized.includes('baby')
  ) {
    return 1;
  }

  if (
    normalized === 'auto emergency' ||
    normalized === 'auto emergencies' ||
    normalized === 'car emergency' ||
    normalized === 'car emergencies'
  ) {
    return 999;
  }

  return 50;
}

function sortDarikCustomerCategories(categoryList: Category[]) {
  return [...categoryList].sort((a, b) => {
    const rankDelta = getDarikCategorySortRank(a.name) - getDarikCategorySortRank(b.name);
    if (rankDelta !== 0) return rankDelta;
    return String(a.name ?? '').localeCompare(String(b.name ?? ''));
  });
}

function getBestSellerDepartmentRank(categoryName: string | null | undefined) {
  const normalized = normalizeCategoryName(categoryName);

  if (
    normalized === 'clothing' ||
    normalized === 'clothes' ||
    normalized === 'fashion' ||
    normalized === 'apparel'
  ) {
    return 0;
  }

  if (
    normalized === 'baby' ||
    normalized === 'baby items' ||
    normalized === 'baby supplies' ||
    normalized === 'infant' ||
    normalized === 'infant supplies' ||
    normalized.includes('baby')
  ) {
    return 1;
  }

  if (
    normalized === 'cosmetics' ||
    normalized === 'cosmetic' ||
    normalized === 'beauty' ||
    normalized === 'beauty supplies' ||
    normalized === 'skincare' ||
    normalized === 'skin care' ||
    normalized === 'makeup' ||
    normalized.includes('cosmetic') ||
    normalized.includes('beauty')
  ) {
    return 2;
  }

  if (
    normalized === 'electrical' ||
    normalized === 'electronics' ||
    normalized === 'electric' ||
    normalized === 'small electronics' ||
    normalized === 'chargers' ||
    normalized === 'cables' ||
    normalized.includes('electric') ||
    normalized.includes('electronic') ||
    normalized.includes('charger') ||
    normalized.includes('cable')
  ) {
    return 3;
  }

  return 50;
}

function sortBestSellerDepartments(categoryList: Category[]) {
  return [...categoryList].sort((a, b) => {
    const rankDelta = getBestSellerDepartmentRank(a.name) - getBestSellerDepartmentRank(b.name);
    if (rankDelta !== 0) return rankDelta;
    return String(a.name ?? '').localeCompare(String(b.name ?? ''));
  });
}

function getDarikCategoryMicroCopy(categoryName: string | null | undefined) {
  const normalized = normalizeCategoryName(categoryName);

  if (
    normalized === 'clothing' ||
    normalized === 'clothes' ||
    normalized === 'fashion' ||
    normalized === 'apparel'
  ) {
    return 'Sizes ready';
  }

  if (
    normalized === 'baby' ||
    normalized === 'baby items' ||
    normalized === 'baby supplies' ||
    normalized === 'infant' ||
    normalized === 'infant supplies' ||
    normalized.includes('baby')
  ) {
    return 'Daily care';
  }

  if (
    normalized === 'cosmetics' ||
    normalized === 'cosmetic' ||
    normalized === 'beauty' ||
    normalized === 'beauty supplies' ||
    normalized === 'skincare' ||
    normalized === 'skin care' ||
    normalized === 'makeup' ||
    normalized.includes('cosmetic') ||
    normalized.includes('beauty')
  ) {
    return 'Beauty picks';
  }

  if (
    normalized === 'pets' ||
    normalized === 'pet' ||
    normalized === 'pet items' ||
    normalized === 'pet supplies' ||
    normalized === 'animals' ||
    normalized.includes('pet')
  ) {
    return 'Pet essentials';
  }

  if (
    normalized === 'auto emergency' ||
    normalized === 'auto emergencies' ||
    normalized === 'car emergency' ||
    normalized === 'car emergencies'
  ) {
    return 'Road ready';
  }

  return 'Live items';
}

export default function HomeScreen() {
  const [loading, setLoading] = useState(true);
  const [appLanguage, setAppLanguage] = useState<AppLanguage>('en');
  const [categories, setCategories] = useState<Category[]>([]);
  const [marketplaceCategorySubcategories, setMarketplaceCategorySubcategories] = useState<MarketplaceCategorySubcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsPage, setProductsPage] = useState(0);
  const [productsHasMore, setProductsHasMore] = useState(true);
  const [productsLoadingPage, setProductsLoadingPage] = useState(false);
  const [productsLoadingMore, setProductsLoadingMore] = useState(false);
  const [productResultCount, setProductResultCount] = useState(0);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [customerAdBanners, setCustomerAdBanners] = useState<CustomerAdBanner[]>([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [selectedRetailerId, setSelectedRetailerId] = useState<string | null>(null);
  const [selectedStoreRetailerId, setSelectedStoreRetailerId] = useState<string | null>(null);
  const [storefrontVisible, setStorefrontVisible] = useState(false);
  const bannerScrollRef = useRef<ScrollView | null>(null);
  const quietRefreshInFlightRef = useRef(false);
  const productRefreshInFlightRef = useRef(false);
  const productSearchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bestSellerUserScrolledDownRef = useRef(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedForLaterItems, setSavedForLaterItems] = useState<CartItem[]>([]);
  const [cartProductSnapshots, setCartProductSnapshots] = useState<Product[]>([]);
  const [cartStorageReady, setCartStorageReady] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [orderPlacedVisible, setOrderPlacedVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductPhotoIndex, setSelectedProductPhotoIndex] = useState(0);
  const [productDetailVisible, setProductDetailVisible] = useState(false);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [productVariantsByProductId, setProductVariantsByProductId] = useState<Record<string, ProductVariant[]>>({});
  const [selectedVariantByProductId, setSelectedVariantByProductId] = useState<Record<string, string>>({});
  const [exchangeSizeModalVisible, setExchangeSizeModalVisible] = useState(false);
  const [exchangeSizeOrder, setExchangeSizeOrder] = useState<CustomerOrder | null>(null);
  const [exchangeSizeItem, setExchangeSizeItem] = useState<CustomerOrderItem | null>(null);
  const [exchangeSizeVariants, setExchangeSizeVariants] = useState<ProductVariant[]>([]);
  const [exchangeSizeLoading, setExchangeSizeLoading] = useState(false);
  const [exchangeCheckoutVisible, setExchangeCheckoutVisible] = useState(false);
  const [selectedExchangeVariant, setSelectedExchangeVariant] = useState<ProductVariant | null>(null);

  const [searchText, setSearchText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('BestSellers');
  const [selectedProductSort, setSelectedProductSort] = useState<ProductSortOption>('best_sellers');
  const [bestSellerVisibleCategoryCount, setBestSellerVisibleCategoryCount] = useState(BEST_SELLER_INITIAL_CATEGORY_COUNT);
  const [bestSellerPageByCategoryId, setBestSellerPageByCategoryId] = useState<Record<string, number>>({});
  const [selectedClothingDepartment, setSelectedClothingDepartment] = useState('All');
  const [selectedClothingItemType, setSelectedClothingItemType] = useState('All');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [cliqProofUploading, setCliqProofUploading] = useState(false);
  const [cliqUploadedProofName, setCliqUploadedProofName] = useState('');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<DeliveryOptionType | ''>('');
  const [currentDeliveryTime, setCurrentDeliveryTime] = useState(new Date());

  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation | null>(null);
  const [deliveryLocationConfirmed, setDeliveryLocationConfirmed] = useState(false);
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  const [savedLocations, setSavedLocations] = useState<SavedCustomerLocation[]>([]);
  const [saveLocationVisible, setSaveLocationVisible] = useState(false);
  const [saveLocationLabel, setSaveLocationLabel] = useState('');
  const [savingLocation, setSavingLocation] = useState(false);
  const [returnToCheckoutAfterSaveLocation, setReturnToCheckoutAfterSaveLocation] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [rememberMe, setRememberMe] = useState(true);
  const [customerSession, setCustomerSession] = useState<Session | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [passwordResetOpen, setPasswordResetOpen] = useState(false);
  const [passwordResetEmail, setPasswordResetEmail] = useState('');
  const [passwordResetBusy, setPasswordResetBusy] = useState(false);
  const [passwordResetSent, setPasswordResetSent] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPhoneConfirm, setSignupPhoneConfirm] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupEmailCode, setSignupEmailCode] = useState('');
  const [signupConfirmationCodeSent, setSignupConfirmationCodeSent] = useState(false);
  const [signupCodeCooldownSeconds, setSignupCodeCooldownSeconds] = useState(0);
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');

  const [placedOrderDeliveryPin, setPlacedOrderDeliveryPin] = useState('');
  const placeOrderInFlightRef = useRef(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [lastOrderConfirmation, setLastOrderConfirmation] = useState<OrderConfirmationSnapshot | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [customerOrderItems, setCustomerOrderItems] = useState<CustomerOrderItem[]>([]);
  const [darikReturnRequests, setDarikReturnRequests] = useState<DarikReturnRequest[]>([]);
  const [customerReturnAllowance, setCustomerReturnAllowance] = useState({
    usage_month: '',
    free_pickups_used: 0,
    paid_pickups_used: 0,
    free_pickups_remaining: 3,
    next_pickup_fee_amount: 0,
    next_free_returns_reset_date: '',
  });
  const [returnRequestBusyItemId, setReturnRequestBusyItemId] = useState('');
  const [ordersVisible, setOrdersVisible] = useState(false);
  const [selectedCustomerOrder, setSelectedCustomerOrder] = useState<CustomerOrder | null>(null);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [cancellationRequests, setCancellationRequests] = useState<CustomerCancellationRequest[]>([]);
  const [cancelRequestModalVisible, setCancelRequestModalVisible] = useState(false);
  const [cancelRequestOrder, setCancelRequestOrder] = useState<CustomerOrder | null>(null);
  const [cancelRequestReason, setCancelRequestReason] = useState(CUSTOMER_CANCELLATION_REASONS[0]);
  const [cancelRequestOtherText, setCancelRequestOtherText] = useState('');
  const [cancelRequestBusy, setCancelRequestBusy] = useState(false);
  const [inlineCancelRequestOrderId, setInlineCancelRequestOrderId] = useState<string | null>(null);

  const [supportVisible, setSupportVisible] = useState(false);
  const [supportThreads, setSupportThreads] = useState<SupportThread[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [selectedSupportThreadId, setSelectedSupportThreadId] = useState<string | null>(null);
  const [supportIssueType, setSupportIssueType] = useState(CUSTOMER_SUPPORT_ISSUE_TYPES[0]);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessageBody, setSupportMessageBody] = useState('');
  const [supportRelatedOrderId, setSupportRelatedOrderId] = useState<string | null>(null);
  const [supportReplyBody, setSupportReplyBody] = useState('');
  const [supportBusy, setSupportBusy] = useState(false);

  const [customerSettingsVisible, setCustomerSettingsVisible] = useState(false);
  const [customerOtherOptionsVisible, setCustomerOtherOptionsVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [newCustomerPassword, setNewCustomerPassword] = useState('');
  const [confirmCustomerPassword, setConfirmCustomerPassword] = useState('');
  const [changePasswordBusy, setChangePasswordBusy] = useState(false);

  function cleanOrderStatus(status: string | null | undefined) {
    const normalized = String(status ?? '').trim().toLowerCase();
    if (normalized === 'placed') return t('orderReceivedStatus');
    if (['accepted', 'preparing', 'packing', 'ready_for_driver'].includes(normalized)) {
      return t('beingPreparedStatus');
    }
    if (normalized === 'out_for_delivery') return t('outForDeliveryStatus');
    if (normalized === 'delivered') return t('deliveredStatus');
    if (normalized === 'cancelled') return t('cancelledStatus');
    if (normalized === 'cash_on_delivery' || normalized === 'cash') return t('cashOnDelivery');
    if (normalized === 'card') return appLanguage === 'ar' ? 'بطاقة' : 'Card';
    if (normalized === 'apple_pay') return 'Apple Pay';
    return String(status ?? 'unknown')
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function isPreparingOrder(status: string | null | undefined) {
    return ['placed', 'accepted', 'preparing', 'packing', 'ready_for_driver'].includes(String(status));
  }

  function isCancelledOrder(status: string | null | undefined) {
    return String(status) === 'cancelled';
  }

  function isCustomerAccountRestricted(profile: CustomerProfile | null | undefined) {
    return Boolean(profile?.account_restricted);
  }

  function getCustomerRestrictionMessage(profile: CustomerProfile | null | undefined) {
    if (!isCustomerAccountRestricted(profile)) return '';

    const reason = String(profile?.restriction_reason ?? '').trim();
    const note = String(profile?.restriction_note ?? '').trim();

    if (note) {
      return `Your Darik account is currently restricted. ${note}`;
    }

    if (reason) {
      return `Your Darik account is currently restricted due to: ${reason}. Please contact Darik support.`;
    }

    return 'Your Darik account is currently restricted due to a policy issue. Please contact Darik support.';
  }

  function getCancelledOrderText(order: CustomerOrder) {
    const reason = String(order.cancelled_reason ?? '').trim();
    if (reason.length > 0) return reason;
    return CANCELLED_ORDER_MESSAGE;
  }

  function getCustomerPaidDeliveryFeeForOrder(order: CustomerOrder | null | undefined) {
    if (!order) return 0;

    const storedDeliveryFee = Number(order.delivery_fee ?? 0);

    if (order.delivery_option) {
      return Number(Math.max(0, storedDeliveryFee).toFixed(2));
    }

    const subtotalValue = Number(order.subtotal ?? 0);
    const totalValue = Number(order.total ?? 0);

    if (!Number.isFinite(subtotalValue) || !Number.isFinite(totalValue)) {
      return Math.max(0, Number(storedDeliveryFee.toFixed(2)));
    }

    // Legacy safety: old free-delivery orders stored 2.00 as base delivery,
    // but the customer total already excluded it. New orders store 0 or 2 directly.
    const paidDeliveryFee = Math.max(0, totalValue - subtotalValue);
    return Number(Math.min(storedDeliveryFee, paidDeliveryFee).toFixed(2));
  }

  function getDeliverySavingsForOrder(order: CustomerOrder | null | undefined) {
    if (!order) return 0;

    if (order.delivery_option === 'next_day_free') {
      return EXPRESS_DELIVERY_FEE;
    }

    const storedDeliveryFee = Number(order.delivery_fee ?? 0);
    const paidDeliveryFee = getCustomerPaidDeliveryFeeForOrder(order);
    const savedDeliveryFee = storedDeliveryFee - paidDeliveryFee;

    return Number(Math.max(0, savedDeliveryFee).toFixed(2));
  }

  function getOrderDeliveryConfig(order: CustomerOrder | null | undefined) {
    if (!order) return DELIVERY_OPTIONS.next_day_free;
    if (order.delivery_option) return getDeliveryOptionConfig(order.delivery_option);

    const paidDeliveryFee = getCustomerPaidDeliveryFeeForOrder(order);
    return paidDeliveryFee >= EXPRESS_DELIVERY_FEE ? DELIVERY_OPTIONS.express_2hr : DELIVERY_OPTIONS.next_day_free;
  }

  function getOrderDeliveryLabel(order: CustomerOrder | null | undefined) {
    const fallbackOption: DeliveryOptionType = order?.delivery_option === 'express_2hr' ? 'express_2hr' : 'next_day_free';
    if (appLanguage === 'ar') {
      return fallbackOption === 'express_2hr' ? t('expressDeliveryLabel') : t('nextDayDeliveryLabel');
    }
    if (!order) return DELIVERY_OPTIONS.next_day_free.label;
    return order.delivery_label || getOrderDeliveryConfig(order).label;
  }

  function getOrderDeliveryEtaLabel(order: CustomerOrder | null | undefined) {
    if (!order) return getLocalizedDynamicDeliveryEtaLabel('next_day_free', currentDeliveryTime);

    const deliveryConfig = getOrderDeliveryConfig(order);
    const orderCreatedAt = order.created_at ? new Date(order.created_at) : currentDeliveryTime;

    if (appLanguage === 'ar') {
      return getLocalizedDynamicDeliveryEtaLabel(deliveryConfig.value, orderCreatedAt);
    }

    if (order.delivery_eta_label) return order.delivery_eta_label;
    return getLocalizedDynamicDeliveryEtaLabel(deliveryConfig.value, orderCreatedAt);
  }

  function formatOrderDate(dateText: string | null | undefined) {
    if (!dateText) return t('notSet');
    return new Date(dateText).toLocaleString(appLanguage === 'ar' ? 'ar-JO' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getCustomerOrderItems(orderId: string) {
    return customerOrderItems.filter((item) => item.order_id === orderId);
  }

  function getNextFreeReturnsResetDateValue(usageMonthValue?: string | null) {
    const rawMonth = String(usageMonthValue ?? '').trim();
    const match = rawMonth.match(/^(\d{4})-(\d{2})$/);
    const now = new Date();

    const currentYear = match ? Number(match[1]) : now.getFullYear();
    const currentMonthNumber = match ? Number(match[2]) : now.getMonth() + 1;

    const resetMonthNumber = currentMonthNumber === 12 ? 1 : currentMonthNumber + 1;
    const resetYear = currentMonthNumber === 12 ? currentYear + 1 : currentYear;

    return `${resetYear}-${String(resetMonthNumber).padStart(2, '0')}-01`;
  }

  function getDefaultCustomerReturnAllowance() {
    const currentMonth = new Date().toISOString().slice(0, 7);

    return {
      usage_month: currentMonth,
      free_pickups_used: 0,
      paid_pickups_used: 0,
      free_pickups_remaining: 3,
      next_pickup_fee_amount: 0,
      next_free_returns_reset_date: getNextFreeReturnsResetDateValue(currentMonth),
    };
  }

  function normalizeReturnAllowanceRow(row: any) {
    const fallbackMonth = new Date().toISOString().slice(0, 7);
    const usageMonth = String(row?.usage_month ?? fallbackMonth);
    const freeUsed = Number(row?.free_pickups_used ?? 0);
    const paidUsed = Number(row?.paid_pickups_used ?? 0);
    const remaining = Number(row?.free_pickups_remaining ?? Math.max(0, 3 - freeUsed));
    const nextFee = Number(row?.next_pickup_fee_amount ?? (remaining > 0 ? 0 : 2));
    const resetDate = String(
      row?.next_free_returns_reset_date ??
      row?.next_reset_date ??
      row?.reset_date ??
      getNextFreeReturnsResetDateValue(usageMonth)
    );

    return {
      usage_month: usageMonth,
      free_pickups_used: Number.isFinite(freeUsed) ? freeUsed : 0,
      paid_pickups_used: Number.isFinite(paidUsed) ? paidUsed : 0,
      free_pickups_remaining: Number.isFinite(remaining) ? Math.max(0, Math.min(3, Math.floor(remaining))) : 3,
      next_pickup_fee_amount: Number.isFinite(nextFee) ? Math.max(0, nextFee) : 0,
      next_free_returns_reset_date: resetDate,
    };
  }

  function getFreeReturnsRemainingThisMonth() {
    const value = Number(customerReturnAllowance.free_pickups_remaining ?? 3);
    if (!Number.isFinite(value)) return 3;
    return Math.max(0, Math.min(3, Math.floor(value)));
  }

  function getFreeReturnsUsedThisMonth() {
    const value = Number(customerReturnAllowance.free_pickups_used ?? 0);
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.floor(value));
  }

  function getNextReturnPickupFeeAmount() {
    const value = Number(customerReturnAllowance.next_pickup_fee_amount ?? 0);
    if (!Number.isFinite(value)) return getFreeReturnsRemainingThisMonth() > 0 ? 0 : 2;
    return Math.max(0, value);
  }

  function getNextFreeReturnsResetDateLabel() {
    const resetDateValue = String(
      customerReturnAllowance.next_free_returns_reset_date ||
      getNextFreeReturnsResetDateValue(customerReturnAllowance.usage_month)
    );
    const match = resetDateValue.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (!match) return resetDateValue || 'the 1st of next month';

    const displayDate = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));

    return displayDate.toLocaleDateString([], {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  async function loadCustomerReturnAllowance(profileId?: string | null) {
    if (!profileId) {
      setCustomerReturnAllowance(getDefaultCustomerReturnAllowance());
      return;
    }

    const rpcResult = await supabase.rpc('customer_get_return_allowance', {
      p_customer_id: profileId,
    });

    if (!rpcResult.error && rpcResult.data) {
      const row = Array.isArray(rpcResult.data) ? rpcResult.data[0] : rpcResult.data;
      setCustomerReturnAllowance(normalizeReturnAllowanceRow(row));
      return;
    }

    // Fallback: keeps the app working even before the helper RPC is installed.
    const currentMonth = new Date().toISOString().slice(0, 7);
    const usageResult = await supabase
      .from('customer_monthly_return_usage')
      .select('usage_month, free_pickups_used, paid_pickups_used')
      .eq('customer_id', profileId)
      .eq('usage_month', currentMonth)
      .maybeSingle();

    if (!usageResult.error && usageResult.data) {
      const freeUsed = Number(usageResult.data.free_pickups_used ?? 0);
      const remaining = Math.max(0, 3 - freeUsed);
      setCustomerReturnAllowance(normalizeReturnAllowanceRow({
        ...usageResult.data,
        free_pickups_remaining: remaining,
        next_pickup_fee_amount: remaining > 0 ? 0 : 2,
        next_free_returns_reset_date: getNextFreeReturnsResetDateValue(currentMonth),
      }));
      return;
    }

    setCustomerReturnAllowance(getDefaultCustomerReturnAllowance());
  }

  function getReturnRequestForItem(orderItemId: string) {
    return darikReturnRequests.find((request) => request.order_item_id === orderItemId);
  }

  function getReturnStatusLabel(status: string | null | undefined) {
    const clean = String(status ?? '');
    if (clean === 'requested') return 'Waiting for Darik review';
    if (clean === 'pickup_approved') return 'Pickup approved — no credit yet';
    if (clean === 'pickup_scheduled') return 'Pickup scheduled';
    if (clean === 'picked_up') return 'Picked up by Darik';
    if (clean === 'under_inspection') return 'Under Darik inspection';
    if (clean === 'fully_approved_credit_issued') return 'Credit issued';
    if (clean === 'fully_approved_replacement_completed') return 'Replacement exchange completed';
    if (clean === 'denied_first_review') return 'Return denied';
    if (clean === 'rejected_after_inspection') return 'Rejected after inspection';
    if (clean === 'cancelled_by_customer') return 'Return request cancelled';
    if (clean === 'cancelled') return 'Return cancelled';
    return clean.replace(/_/g, ' ');
  }

  function canRequestDarikReturnForOrder(order: CustomerOrder) {
    if (order.order_status !== 'delivered') return false;
    if (!order.delivered_at) return true;
    const deliveredTime = new Date(order.delivered_at).getTime();
    if (!Number.isFinite(deliveredTime)) return true;
    return Date.now() - deliveredTime <= 24 * 60 * 60 * 1000;
  }

  function canCancelDarikReturnRequest(request: DarikReturnRequest | undefined | null) {
    if (!request) return false;
    return ['requested', 'pickup_approved', 'pickup_scheduled'].includes(String(request.status ?? ''));
  }


  function isCustomerExchangeDeliveryOrder(order: CustomerOrder | null | undefined) {
    if (!order) return false;
    const orderKind = String(order.order_kind ?? '').toLowerCase();
    const payment = String(order.payment_method ?? '').toLowerCase();
    const deliveryLabel = String(order.delivery_label ?? '').toLowerCase();
    const adminNote = String(order.admin_status_note ?? '').toLowerCase();

    return (
      orderKind.includes('exchange') ||
      orderKind.includes('replacement') ||
      payment.includes('exchange') ||
      deliveryLabel.includes('exchange') ||
      deliveryLabel.includes('replacement') ||
      adminNote.includes('replacement delivery')
    );
  }

  function isCustomerDarikCreditDeliveryOrder(order: CustomerOrder | null | undefined) {
    if (!order) return false;
    const payment = String(order.payment_method ?? '').toLowerCase();
    const creditApplied = Number(order.darik_credit_applied_amount ?? 0);
    const customerAmountDue = Number(order.customer_amount_due ?? order.total ?? 0);

    return (
      payment.includes('darik_credit') ||
      payment.includes('customer_credit') ||
      payment === 'credit' ||
      payment.includes('app_credit') ||
      (Number.isFinite(creditApplied) && creditApplied > 0 && Number.isFinite(customerAmountDue) && customerAmountDue <= 0.005)
    );
  }

  function isActiveCustomerDeliveryOrderForPin(order: CustomerOrder | null | undefined) {
    if (!order) return false;
    const status = String(order.order_status ?? '').toLowerCase();
    return ['placed', 'accepted', 'preparing', 'packing', 'ready_for_driver', 'out_for_delivery'].includes(status);
  }

  function shouldShowCustomerDeliveryPin(order: CustomerOrder | null | undefined) {
    if (!order) return false;
    if (!isActiveCustomerDeliveryOrderForPin(order)) return false;
    if (!String(order.delivery_pin ?? '').trim()) return false;

    return isCustomerExchangeDeliveryOrder(order) || isCustomerDarikCreditDeliveryOrder(order) || order.order_status === 'out_for_delivery';
  }

  function getCustomerDeliveryPinLabel(order: CustomerOrder | null | undefined) {
    if (isCustomerExchangeDeliveryOrder(order)) return t('exchangeDeliveryPin');
    if (isCustomerDarikCreditDeliveryOrder(order)) return t('darikCreditDeliveryPin');
    return t('deliveryPinLabel');
  }

  function getCustomerDeliveryPinHelpText(order: CustomerOrder | null | undefined) {
    if (isCustomerExchangeDeliveryOrder(order)) {
      return t('givePinReplacementHelp');
    }

    if (isCustomerDarikCreditDeliveryOrder(order)) {
      return t('givePinDarikCreditHelp');
    }

    return t('givePinNormalHelp');
  }

  function isExactReplacementReturn(request: DarikReturnRequest | null | undefined) {
    return String(request?.return_resolution_type ?? '').toLowerCase() === 'exact_replacement';
  }

  function getReturnResolutionLabel(request: DarikReturnRequest | null | undefined) {
    if (isExactReplacementReturn(request)) return t('optionTwoExactReplacement').replace('Option 2: ', '').replace('الخيار 2: ', '');
    return t('darikCreditButton');
  }

  function getReturnCreditPickupFeeToDeduct(request: DarikReturnRequest | null | undefined) {
    const value = Number(request?.credit_pickup_fee_to_deduct_amount ?? request?.credit_pickup_fee_deducted_amount ?? request?.pickup_fee_amount ?? 0);
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, value);
  }

  function getReturnNetCreditAmount(request: DarikReturnRequest | null | undefined, fallbackLineTotal?: number | string | null) {
    if (isExactReplacementReturn(request)) return 0;

    const storedNet = Number(request?.net_credit_issued_amount ?? request?.credit_issued_amount ?? NaN);
    if (Number.isFinite(storedNet) && storedNet >= 0) return storedNet;

    const grossCredit = Number(request?.line_total ?? fallbackLineTotal ?? 0);
    const feeToDeduct = getReturnCreditPickupFeeToDeduct(request);

    if (!Number.isFinite(grossCredit)) return 0;
    return Math.max(0, Number((grossCredit - feeToDeduct).toFixed(2)));
  }

  function getEstimatedCreditReturnNetAmount(item: CustomerOrderItem) {
    const grossCredit = Number(item.line_total ?? 0);
    const fee = getNextReturnPickupFeeAmount();
    if (!Number.isFinite(grossCredit)) return 0;
    return Math.max(0, Number((grossCredit - fee).toFixed(2)));
  }


  function getLatestCancellationRequestForOrder(orderId: string) {
    return cancellationRequests
      .filter((request) => request.order_id === orderId)
      .sort(
        (a, b) =>
          new Date(b.requested_at || b.created_at || 0).getTime() -
          new Date(a.requested_at || a.created_at || 0).getTime(),
      )[0];
  }

  function renderCancellationRequestStatus(order: CustomerOrder) {
    const latestRequest = getLatestCancellationRequestForOrder(order.id);
    if (!latestRequest) return null;

    if (latestRequest.request_status === 'pending') {
      return (
        <View style={{ marginTop: 10, borderRadius: 16, backgroundColor: '#FFF8D8', borderWidth: 1, borderColor: '#FFD23F', padding: 10 }}>
          <Text style={{ color: '#111111', fontSize: 12, fontWeight: '900' }}>
            Cancellation request pending admin review
          </Text>
          <Text style={{ color: '#555555', fontSize: 11, fontWeight: '700', marginTop: 4 }}>
            Reason: {latestRequest.reason_category}
          </Text>
        </View>
      );
    }

    if (latestRequest.request_status === 'denied') {
      return (
        <View style={{ marginTop: 10, borderRadius: 16, backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FCA5A5', padding: 10 }}>
          <Text style={{ color: '#991B1B', fontSize: 12, fontWeight: '900' }}>
            Cancellation request denied
          </Text>
          <Text style={{ color: '#7F1D1D', fontSize: 11, fontWeight: '700', marginTop: 4, lineHeight: 16 }}>
            {latestRequest.admin_decision_note || 'Darik could not cancel this order.'}
          </Text>
        </View>
      );
    }

    if (latestRequest.request_status === 'approved') {
      return (
        <View style={{ marginTop: 10, borderRadius: 16, backgroundColor: '#DCFCE7', borderWidth: 1, borderColor: '#86EFAC', padding: 10 }}>
          <Text style={{ color: '#166534', fontSize: 12, fontWeight: '900' }}>
            Cancellation approved
          </Text>
          <Text style={{ color: '#166534', fontSize: 11, fontWeight: '700', marginTop: 4 }}>
            This order was cancelled by Darik admin.
          </Text>
        </View>
      );
    }

    return null;
  }

  function getCancellationRequestForOrder(orderId: string) {
    return cancellationRequests.find((request) => request.order_id === orderId);
  }

  function canRequestCancellation(order: CustomerOrder) {
    const status = String(order.order_status ?? '').toLowerCase();

    // Customer can request cancellation while Darik is still preparing/reviewing/readying the order.
    // Do not allow it once the order is already out for delivery, delivered, or cancelled.
    if (
      status.includes('delivered') ||
      status.includes('cancelled') ||
      status.includes('out_for_delivery') ||
      status.includes('out for delivery')
    ) {
      return false;
    }

    const existingRequest = getCancellationRequestForOrder(order.id);
    return !existingRequest || ['denied', 'cancelled_by_customer'].includes(String(existingRequest.request_status));
  }

  function openCancelRequestModal(order: CustomerOrder) {
    if (!canRequestCancellation(order)) {
      const existingRequest = getCancellationRequestForOrder(order.id);
      if (existingRequest?.request_status === 'pending') {
        Alert.alert('Cancellation Pending', 'Your cancellation request is already waiting for Darik admin review.');
        return;
      }

      Alert.alert('Cannot Request Cancellation', 'This order can no longer be cancelled from the app. Please contact Darik support.');
      return;
    }

    setCancelRequestOrder(order);
    setCancelRequestReason(CUSTOMER_CANCELLATION_REASONS[0]);
    setCancelRequestOtherText('');
    setCancelRequestModalVisible(true);
  }


  function openCancelRequestFromOrderDetail(order: CustomerOrder) {
    if (!canRequestCancellation(order)) {
      openCancelRequestModal(order);
      return;
    }

    setOrderDetailVisible(false);
    setSelectedCustomerOrder(null);

    setTimeout(() => {
      openCancelRequestModal(order);
    }, 140);
  }




  function renderInlineCancellationForm(order: CustomerOrder) {
    if (inlineCancelRequestOrderId !== order.id) return null;

    return (
      <View
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          borderWidth: 1,
          borderColor: '#FFD23F',
          padding: 14,
          marginTop: 12,
          marginBottom: 12,
        }}
      >
        <Text style={{ color: '#111111', fontSize: 15, fontWeight: '900' }}>
          Choose cancellation reason
        </Text>

        <View style={{ gap: 8, marginTop: 12 }}>
          {CUSTOMER_CANCELLATION_REASONS.map((reason) => (
            <TouchableOpacity
              key={reason}
              style={{
                borderRadius: 16,
                borderWidth: 1,
                borderColor: cancelRequestReason === reason ? '#111111' : '#DDDDDD',
                backgroundColor: cancelRequestReason === reason ? '#FFF8D8' : '#FFFFFF',
                padding: 12,
              }}
              onPress={() => setCancelRequestReason(reason)}
            >
              <Text style={{ color: '#111111', fontSize: 13, fontWeight: '900' }}>
                {reason}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {(cancelRequestReason === 'Other' ||
          cancelRequestReason === 'Wrong item or quantity' ||
          cancelRequestReason === 'Delivery time no longer works') && (
          <TextInput
            style={[styles.formInput, { minHeight: 88, textAlignVertical: 'top', marginTop: 12 }]}
            placeholder={t('supportMessagePlaceholder')}
            placeholderTextColor="#888"
            value={cancelRequestOtherText}
            onChangeText={setCancelRequestOtherText}
            multiline
          />
        )}

        <TouchableOpacity
          style={{
            marginTop: 12,
            borderRadius: 18,
            backgroundColor: '#111111',
            paddingVertical: 13,
            alignItems: 'center',
            opacity: cancelRequestBusy ? 0.6 : 1,
          }}
          onPress={() => submitInlineCancelRequest(order)}
          disabled={cancelRequestBusy}
        >
          <Text style={{ color: '#FFD23F', fontSize: 13, fontWeight: '900' }}>
            {cancelRequestBusy ? 'Sending...' : 'Send Cancellation Request'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginTop: 10, alignItems: 'center', paddingVertical: 8 }}
          onPress={() => {
            setInlineCancelRequestOrderId(null);
            setCancelRequestOtherText('');
          }}
          disabled={cancelRequestBusy}
        >
          <Text style={{ color: '#777777', fontSize: 13, fontWeight: '900' }}>
            Close
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function startInlineCancellationRequest(order: CustomerOrder) {
    if (!canRequestCancellation(order)) {
      const existingRequest = getCancellationRequestForOrder(order.id);
      if (existingRequest?.request_status === 'pending') {
        Alert.alert('Cancellation Pending', 'Your cancellation request is already waiting for Darik admin review.');
        return;
      }

      Alert.alert('Cannot Request Cancellation', 'This order can no longer be cancelled from the app. Please contact Darik support.');
      return;
    }

    setCancelRequestModalVisible(false);
    setCancelRequestOrder(order);
    setCancelRequestReason(CUSTOMER_CANCELLATION_REASONS[0]);
    setCancelRequestOtherText('');
    setInlineCancelRequestOrderId(order.id);
  }

  function showInlineCancelRequestForm(order: CustomerOrder) {
    startInlineCancellationRequest(order);
  }

  async function submitInlineCancelRequest(order: CustomerOrder) {
    setCancelRequestOrder(order);
    await submitCancelRequestForOrder(order);
  }

  async function submitCancelRequestForOrder(order: CustomerOrder) {
    if (!order || !customerProfile) return;

    const cleanReason = cancelRequestReason.trim() || 'Other';
    const cleanNote = cancelRequestOtherText.trim();

    if (cleanReason === 'Other' && cleanNote.length < 3) {
      Alert.alert('Tell us why', 'Please type a short reason for cancellation.');
      return;
    }

    setCancelRequestBusy(true);

    const { error } = await supabase.from('customer_order_cancellation_requests').insert({
      order_id: order.id,
      customer_id: customerProfile.id,
      customer_name: order.customer_name || customerProfile.full_name || null,
      customer_phone: order.customer_phone || customerProfile.phone || null,
      order_number: order.id.slice(0, 8).toUpperCase(),
      request_status: 'pending',
      reason_category: cleanReason,
      reason_note: cleanReason === 'Other' ? cleanNote : null,
      customer_message: cleanNote || null,
    });

    setCancelRequestBusy(false);

    if (error) {
      if (String(error.message || '').toLowerCase().includes('duplicate')) {
        Alert.alert('Already Requested', 'This order already has a pending cancellation request.');
      } else {
        Alert.alert('Cancellation Request Error', error.message);
      }
      await loadCustomerOrders(customerProfile.id);
      return;
    }

    setCancelRequestModalVisible(false);
    setCancelRequestOrder(null);
    setCancelRequestOtherText('');
    setInlineCancelRequestOrderId(null);
    await loadCustomerOrders(customerProfile.id);
    Alert.alert('Request Sent', 'Darik admin will review your cancellation request.');
  }

  async function submitCancelRequest() {
    if (!cancelRequestOrder) return;
    await submitCancelRequestForOrder(cancelRequestOrder);
  }


  function openCustomerOrder(order: CustomerOrder) {
    // Close the order-history modal first so the detail screen does not open behind it.
    setSelectedCustomerOrder(order);
    setOrderDetailVisible(false);
    setOrdersVisible(false);

    setTimeout(() => {
      setOrderDetailVisible(true);
    }, 220);
  }

  function closeOrderDetailAndReturnToHistory() {
    setOrderDetailVisible(false);

    setTimeout(() => {
      setOrdersVisible(true);
    }, 120);
  }

  function getSupportMessagesForThread(threadId: string) {
    return supportMessages
      .filter((message) => message.thread_id === threadId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  function getSupportThreadOrderLabel(thread: SupportThread) {
    if (!thread.related_order_id) return '';
    const order = customerOrders.find((customerOrder) => customerOrder.id === thread.related_order_id);
    return order ? `Order ${order.id.slice(0, 8).toUpperCase()}` : `Order ${thread.related_order_id.slice(0, 8).toUpperCase()}`;
  }

  async function loadCustomerSupport(profileId?: string | null) {
    if (!profileId) {
      setSupportThreads([]);
      setSupportMessages([]);
      return;
    }

    const threadsResult = await supabase
      .from('support_threads')
      .select('*')
      .eq('sender_type', 'customer')
      .eq('sender_id', profileId)
      .order('last_message_at', { ascending: false })
      .limit(50);

    if (threadsResult.error) {
      // If the SQL has not been run yet, do not break the customer app.
      setSupportThreads([]);
      setSupportMessages([]);
      return;
    }

    const loadedThreads = (threadsResult.data ?? []) as SupportThread[];
    setSupportThreads(loadedThreads);

    const threadIds = loadedThreads.map((thread) => thread.id);
    if (threadIds.length === 0) {
      setSupportMessages([]);
      return;
    }

    const messagesResult = await supabase
      .from('support_messages')
      .select('*')
      .in('thread_id', threadIds)
      .order('created_at', { ascending: true });

    if (!messagesResult.error) {
      setSupportMessages((messagesResult.data ?? []) as SupportMessage[]);
    }
  }

  async function openSupportCenter(order?: CustomerOrder | null) {
    if (!customerProfile) {
      Alert.alert('Login Required', 'Please log in before contacting Darik support.');
      return;
    }

    const orderId = order?.id ?? null;
    setSupportRelatedOrderId(orderId);
    setSupportIssueType(order ? 'Order issue' : CUSTOMER_SUPPORT_ISSUE_TYPES[0]);
    setSupportSubject(order ? `Help with order ${order.id.slice(0, 8).toUpperCase()}` : '');
    setSupportMessageBody('');
    setSupportReplyBody('');
    setSelectedSupportThreadId(null);
    await loadCustomerSupport(customerProfile.id);
    setSupportVisible(true);
  }

  async function submitSupportThread() {
    if (!customerProfile) return;

    const cleanSubject = supportSubject.trim();
    const cleanMessage = supportMessageBody.trim();

    if (cleanSubject.length < 3) {
      Alert.alert('Subject Required', 'Type a short subject for Darik support.');
      return;
    }

    if (cleanMessage.length < 5) {
      Alert.alert('Message Required', 'Type a short message explaining what you need help with.');
      return;
    }

    setSupportBusy(true);

    const { data, error } = await supabase.rpc('create_support_thread_with_message', {
      p_sender_type: 'customer',
      p_sender_id: customerProfile.id,
      p_sender_name: customerProfile.full_name || customerName || customerSession?.user.email || 'Customer',
      p_sender_phone: customerProfile.phone || customerPhone || null,
      p_sender_email: customerProfile.email || customerSession?.user.email || null,
      p_issue_type: supportIssueType,
      p_subject: cleanSubject,
      p_message_body: cleanMessage,
      p_related_order_id: supportRelatedOrderId,
      p_related_product_id: null,
      p_related_payout_id: null,
    });

    setSupportBusy(false);

    if (error) {
      Alert.alert('Support Error', error.message);
      return;
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (result?.success === false) {
      Alert.alert('Support Error', result.message || 'Could not send support message.');
      return;
    }

    setSupportSubject('');
    setSupportMessageBody('');
    setSupportRelatedOrderId(null);
    await loadCustomerSupport(customerProfile.id);
    setSelectedSupportThreadId(result?.thread_id ?? null);
    Alert.alert('Message Sent', 'Darik support received your message.');
  }

  async function submitSupportReply(thread: SupportThread) {
    if (!customerProfile) return;

    const cleanReply = supportReplyBody.trim();
    if (cleanReply.length < 2) {
      Alert.alert('Reply Required', 'Type your reply first.');
      return;
    }

    setSupportBusy(true);

    const { data, error } = await supabase.rpc('add_support_message', {
      p_thread_id: thread.id,
      p_sender_role: 'customer',
      p_sender_id: customerProfile.id,
      p_sender_name: customerProfile.full_name || customerName || customerSession?.user.email || 'Customer',
      p_message_body: cleanReply,
    });

    setSupportBusy(false);

    if (error) {
      Alert.alert('Reply Error', error.message);
      return;
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (result?.success === false) {
      Alert.alert('Reply Error', result.message || 'Could not send reply.');
      return;
    }

    setSupportReplyBody('');
    await loadCustomerSupport(customerProfile.id);
  }

  function getCustomerDriverProgressLabel(order: CustomerOrder | null | undefined) {
    const label = String(order?.driver_stops_away_label ?? '').trim();
    if (!label) return '';

    const stage = String(order?.driver_stop_progress_stage ?? '').toLowerCase();

    if (stage === 'three_stops_away') return t('driverThreeStopsAway');
    if (stage === 'two_stops_away') return t('driverTwoStopsAway');
    if (stage === 'next_stop') return t('driverNextStop');
    if (stage === 'delivered') return t('driverDeliveredOrder');

    return label;
  }

  function shouldShowCustomerDriverProgress(order: CustomerOrder | null | undefined) {
    const label = getCustomerDriverProgressLabel(order);
    if (!label) return false;

    return ['out_for_delivery', 'ready_for_driver', 'delivered'].includes(String(order?.order_status ?? '').toLowerCase()) ||
      Boolean(order?.driver_stop_progress_stage);
  }

  async function loadCustomerOrders(profileId?: string | null) {
    if (!profileId) {
      setCustomerOrders([]);
      setCustomerOrderItems([]);
      setCancellationRequests([]);
      setDarikReturnRequests([]);
      setCustomerReturnAllowance(getDefaultCustomerReturnAllowance());
      return;
    }

    const ordersResult = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', profileId)
      .in('order_status', CUSTOMER_VISIBLE_ORDER_STATUSES)
      .order('created_at', { ascending: false });

    if (ordersResult.error) {
      Alert.alert('Orders Error', ordersResult.error.message);
      return;
    }

    const loadedOrders = (ordersResult.data ?? []) as CustomerOrder[];
    setCustomerOrders(loadedOrders);

    const orderIds = loadedOrders.map((order) => order.id);

    if (orderIds.length === 0) {
      setCustomerOrderItems([]);
      setCancellationRequests([]);
      setDarikReturnRequests([]);
      await loadCustomerReturnAllowance(profileId);
      return;
    }

    const itemsResult = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds)
      .order('created_at', { ascending: true });

    if (itemsResult.error) {
      Alert.alert('Order Items Error', itemsResult.error.message);
      return;
    }

    setCustomerOrderItems((itemsResult.data ?? []) as CustomerOrderItem[]);

    const cancellationRequestsResult = await supabase
      .from('customer_order_cancellation_requests')
      .select('*')
      .in('order_id', orderIds)
      .order('requested_at', { ascending: false });

    if (!cancellationRequestsResult.error) {
      setCancellationRequests((cancellationRequestsResult.data ?? []) as CustomerCancellationRequest[]);
    }

    const returnsResult = await supabase
      .from('darik_return_requests')
      .select('*')
      .in('order_id', orderIds)
      .order('requested_at', { ascending: false });

    if (!returnsResult.error) {
      setDarikReturnRequests((returnsResult.data ?? []) as DarikReturnRequest[]);
    }

    await loadCustomerReturnAllowance(profileId);
  }

  async function submitDarikReturnRequest(
    order: CustomerOrder,
    item: CustomerOrderItem,
    resolutionType: 'credit_return' | 'exact_replacement',
    replacementVariant?: ProductVariant | null,
    replacementPickupNote?: string
  ) {
    if (!customerProfile) return;

    setReturnRequestBusyItemId(item.id);

    const isReplacement = resolutionType === 'exact_replacement';
    const replacementSizeText = replacementVariant?.size_label ? ` Replacement size requested: ${replacementVariant.size_label}.` : '';
    const cleanReplacementPickupNote = String(replacementPickupNote ?? '').trim();
    const replacementPickupText = cleanReplacementPickupNote ? ` ${cleanReplacementPickupNote}` : '';
    const { data, error } = await supabase.rpc('customer_request_darik_return_v3', {
      p_customer_id: customerProfile.id,
      p_order_id: order.id,
      p_order_item_id: item.id,
      p_resolution_type: resolutionType,
      p_reason_category: isReplacement ? 'Defective item - wants exact replacement' : 'Customer requested Darik Credit return',
      p_customer_note: isReplacement
        ? `Customer chose free exact same item replacement from Order History.${replacementSizeText}${replacementPickupText}`
        : 'Customer chose Darik Credit return from Order History.',
      p_customer_photo_url: null,
      p_replacement_product_variant_id: replacementVariant?.id ?? null,
      p_replacement_size_label: replacementVariant?.size_label ?? null,
    });

    setReturnRequestBusyItemId('');

    if (error) {
      Alert.alert('Return Request Error', error.message);
      return;
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (result?.success === false) {
      Alert.alert('Return Request Error', result.message || 'Could not request return.');
      return;
    }

    Alert.alert(
      isReplacement ? 'Replacement Request Submitted' : 'Credit Return Request Submitted',
      result?.message ||
        (isReplacement
          ? 'Darik will review your replacement request. If approved, the exact replacement goes into next-day delivery and the driver collects the defective item.'
          : 'Darik will review your return request. Credit is issued only after pickup and inspection approval.')
    );

    await loadCustomerOrders(customerProfile.id);
    await loadCustomerReturnAllowance(customerProfile.id);
  }

  function closeExchangeSizePickerAndReturnToOrder() {
    setExchangeSizeModalVisible(false);
    setExchangeSizeOrder(null);
    setExchangeSizeItem(null);
    setExchangeSizeVariants([]);
    setExchangeSizeLoading(false);
    setSelectedExchangeVariant(null);
    setExchangeCheckoutVisible(false);

    // Return customer back to the same order detail screen after closing the size picker.
    setTimeout(() => {
      if (selectedCustomerOrder) {
        setOrderDetailVisible(true);
      }
    }, 180);
  }

  async function openExchangeSizePicker(order: CustomerOrder, item: CustomerOrderItem) {
    const orderSnapshot = order;
    const itemSnapshot = item;

    // React Native modal layer fix:
    // Previously the size picker opened while Order Detail was still visible,
    // so the size picker appeared behind the order screen until the customer closed it.
    setOrdersVisible(false);
    setOrderDetailVisible(false);

    setExchangeSizeOrder(orderSnapshot);
    setExchangeSizeItem(itemSnapshot);
    setExchangeSizeVariants([]);
    setExchangeSizeLoading(true);
    setExchangeSizeModalVisible(false);

    setTimeout(async () => {
      try {
        if (!itemSnapshot.product_id) {
          setExchangeSizeLoading(false);
          setExchangeSizeOrder(null);
          setExchangeSizeItem(null);
          setExchangeSizeVariants([]);

          openExchangeCheckoutAfterSizeModalCloses(null);
          return;
        }

        setExchangeSizeModalVisible(true);

        const variants = await loadProductVariantsForProducts([itemSnapshot.product_id]);
        const activeVariants = variants
          .filter((variant) => variant.product_id === itemSnapshot.product_id)
          .filter((variant) => !['deleted', 'deleted_by_retailer', 'archived'].includes(String(variant.variant_status ?? 'active')))
          .sort((a, b) => Number(a.size_sort_order ?? 100) - Number(b.size_sort_order ?? 100));

        setExchangeSizeVariants(activeVariants);
        setExchangeSizeLoading(false);

        if (activeVariants.length === 0) {
          openExchangeCheckoutAfterSizeModalCloses(null);
        }
      } catch (error: any) {
        setExchangeSizeLoading(false);
        setExchangeSizeModalVisible(false);
        setExchangeSizeOrder(null);
        setExchangeSizeItem(null);
        setExchangeSizeVariants([]);

        setTimeout(() => {
          if (selectedCustomerOrder) {
            setOrderDetailVisible(true);
          }
        }, 250);

        Alert.alert('Replacement Size Error', error?.message ?? 'Could not load replacement sizes.');
      }
    }, 340);
  }

  function openExchangeCheckoutAfterSizeModalCloses(variant?: ProductVariant | null) {
    setSelectedExchangeVariant(variant ?? null);
    setExchangeSizeModalVisible(false);
    setExchangeSizeLoading(false);

    // Important React Native modal safety:
    // Do not open the replacement checkout in the same render tick that closes the size picker.
    // On some phones this can leave the app feeling frozen because two modals fight for focus.
    setTimeout(() => {
      setExchangeCheckoutVisible(true);
    }, 280);
  }

  function chooseExchangeReplacementSize(variant: ProductVariant) {
    if (!exchangeSizeOrder || !exchangeSizeItem) return;
    openExchangeCheckoutAfterSizeModalCloses(variant);
  }

  function closeExchangeReplacementCheckoutAndReturnToOrder() {
    setExchangeCheckoutVisible(false);
    setSelectedExchangeVariant(null);
    setExchangeSizeOrder(null);
    setExchangeSizeItem(null);
    setExchangeSizeVariants([]);
    setExchangeSizeLoading(false);

    setTimeout(() => {
      if (selectedCustomerOrder) {
        setOrderDetailVisible(true);
      }
    }, 180);
  }

  async function submitExchangeReplacementFromCheckout() {
    if (!exchangeSizeOrder || !exchangeSizeItem) return;

    if (!deliveryLocation) {
      Alert.alert(t('pickupLocation'), t('replacementCheckoutMissingLocation'));
      return;
    }

    if (!String(deliveryAddress ?? '').trim()) {
      Alert.alert(t('pickupLocation'), t('replacementCheckoutMissingAddress'));
      return;
    }

    const pickupNoteParts = [
      `Replacement pickup location: ${String(deliveryAddress ?? '').trim()}.`,
      `Pickup GPS: ${deliveryLocation.latitude.toFixed(6)}, ${deliveryLocation.longitude.toFixed(6)}.`,
      deliveryNote ? `Pickup note: ${deliveryNote}.` : '',
    ].filter(Boolean);

    const order = exchangeSizeOrder;
    const item = exchangeSizeItem;
    const replacementVariant = selectedExchangeVariant;

    setExchangeCheckoutVisible(false);
    setSelectedExchangeVariant(null);
    setExchangeSizeOrder(null);
    setExchangeSizeItem(null);
    setExchangeSizeVariants([]);
    setExchangeSizeLoading(false);

    await submitDarikReturnRequest(
      order,
      item,
      'exact_replacement',
      replacementVariant,
      pickupNoteParts.join(' ')
    );

    setTimeout(() => {
      if (selectedCustomerOrder) {
        setOrderDetailVisible(true);
      }
    }, 350);
  }

  async function requestDarikReturn(order: CustomerOrder, item: CustomerOrderItem) {
    if (!customerProfile) return;

    const existing = getReturnRequestForItem(item.id);
    if (existing) {
      Alert.alert(t('returnAlreadyRequested'), `${t('returnStatus')}: ${getReturnStatusLabel(existing.status)}`);
      return;
    }

    if (!canRequestDarikReturnForOrder(order)) {
      Alert.alert(t('returnWindowClosedTitle'), t('returnWindowClosedText'));
      return;
    }

    const nextPickupFee = getNextReturnPickupFeeAmount();
    const estimatedCredit = getEstimatedCreditReturnNetAmount(item);

    Alert.alert(
      t('chooseReturnOption'),
      `${getOrderItemDisplayName(item)}

${t('optionOneDarikCreditReturn')}
${t('grossCredit')}: ${money(item.line_total)} JOD
${t('pickupFeeDeductedFromCredit')}: ${money(nextPickupFee)} JOD
${t('estimatedCreditAfterDeduction')}: ${money(estimatedCredit)} JOD
${t('freeReturnsRemainingThisMonth')}: ${getFreeReturnsRemainingThisMonth()}
${t('freeReturnsResetOn')}: ${getNextFreeReturnsResetDateLabel()}

${t('optionTwoExactReplacement')}
${t('exactReplacementExplanation')}`,
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('darikCreditButton'),
          onPress: () => submitDarikReturnRequest(order, item, 'credit_return'),
        },
        {
          text: t('replaceItemButton'),
          onPress: () => openExchangeSizePicker(order, item),
        },
      ],
    );
  }


  async function cancelDarikReturnRequest(returnRequest: DarikReturnRequest, item: CustomerOrderItem) {
    if (!customerProfile) return;

    if (!canCancelDarikReturnRequest(returnRequest)) {
      Alert.alert(t('cannotCancelReturnTitle'), t('cannotCancelReturnText'));
      return;
    }

    Alert.alert(
      t('cancelReturnRequestTitle'),
      `${getOrderItemDisplayName(item)}\n\n${t('cancelReturnRequestText')}`,
      [
        { text: t('keepReturnButton'), style: 'cancel' },
        {
          text: t('cancelReturnButton'),
          style: 'destructive',
          onPress: async () => {
            setReturnRequestBusyItemId(item.id);
            const { data, error } = await supabase.rpc('customer_cancel_darik_return', {
              p_customer_id: customerProfile.id,
              p_return_request_id: returnRequest.id,
              p_cancel_reason: 'Customer cancelled return request from Order History.',
            });
            setReturnRequestBusyItemId('');

            if (error) {
              Alert.alert(t('cancelReturnErrorTitle'), error.message);
              return;
            }

            const result = Array.isArray(data) ? data[0] : data;
            if (result?.success === false) {
              Alert.alert(t('cancelReturnErrorTitle'), result.message || 'Could not cancel this return request.');
              return;
            }

            Alert.alert(t('returnCancelledTitle'), result?.message || 'Your return request was cancelled.');
            await loadCustomerOrders(customerProfile.id);
          },
        },
      ],
    );
  }

  async function loadCustomerSavedLocations(profileId?: string | null) {
    if (!profileId) {
      setSavedLocations([]);
      return;
    }

    const savedLocationsResult = await supabase
      .from('customer_saved_locations')
      .select('*')
      .eq('customer_id', profileId)
      .order('created_at', { ascending: false });

    if (savedLocationsResult.error) {
      // Do not block checkout if the saved locations table has not been created yet.
      setSavedLocations([]);
      return;
    }

    setSavedLocations((savedLocationsResult.data ?? []) as SavedCustomerLocation[]);
  }

  async function loadProductVariantsForProducts(productIdsInput: string[]) {
    const productIds: string[] = Array.from(new Set<string>(productIdsInput.filter(Boolean))).slice(0, 250);
    if (productIds.length === 0) return [] as ProductVariant[];

    const variantsResult = await supabase
      .from('public_product_variants')
      .select('*')
      .in('product_id', productIds)
      .order('size_sort_order', { ascending: true })
      .order('size_label', { ascending: true });

    if (variantsResult.error) return [] as ProductVariant[];

    const variants = (variantsResult.data ?? []) as ProductVariant[];
    setProductVariantsByProductId((current) => {
      const next = { ...current };
      for (const productId of productIds) {
        next[productId] = variants.filter((variant) => variant.product_id === productId);
      }
      return next;
    });

    setSelectedVariantByProductId((current) => {
      const next = { ...current };
      for (const productId of productIds) {
        if (next[productId]) continue;
        const firstInStock = variants.find((variant) => variant.product_id === productId && Number(variant.quantity_in_stock ?? 0) > 0);
        const firstAny = variants.find((variant) => variant.product_id === productId);
        if (firstInStock || firstAny) next[productId] = (firstInStock || firstAny)!.id;
      }
      return next;
    });

    return variants;
  }

  async function loadProductsPage(options?: { reset?: boolean; quiet?: boolean }) {
    if (productRefreshInFlightRef.current) return;

    const reset = Boolean(options?.reset);
    const nextPage = reset ? 0 : productsPage + 1;
    const activePageSize =
      selectedCategoryId === 'BestSellers' ? BEST_SELLER_PRODUCT_POOL_SIZE : PRODUCT_LIST_PAGE_SIZE;
    const fromRow = nextPage * activePageSize;
    const toRow = fromRow + activePageSize - 1;
    const searchValue = sanitizeProductSearchForPostgrest(searchText);

    productRefreshInFlightRef.current = true;
    if (reset) {
      setProductsLoadingPage(true);
    } else {
      setProductsLoadingMore(true);
    }

    try {
      let productQuery = supabase
        .from('customer_best_seller_products')
        .select('*', { count: 'estimated' })
        .eq('product_status', 'live')
        .gt('quantity_in_stock', 0);

      if (selectedCategoryId !== 'All' && selectedCategoryId !== 'BestSellers') {
        productQuery = productQuery.eq('category_id', selectedCategoryId);
      }

      if (selectedCategoryIsClothing && selectedClothingDepartment !== 'All') {
        productQuery = productQuery.eq('clothing_department', selectedClothingDepartment);
      }

      if (selectedCategoryIsClothing && selectedClothingItemType !== 'All') {
        productQuery = productQuery.eq('clothing_item_type', selectedClothingItemType);
      }

      if (selectedRetailerId) {
        productQuery = productQuery.eq('retailer_id', selectedRetailerId);
      }

      if (searchValue.length > 0) {
        productQuery = productQuery.or(
          `name.ilike.%${searchValue}%,description.ilike.%${searchValue}%,and(arabic_title_status.eq.approved,official_marketplace_name_ar.ilike.%${searchValue}%)`
        );
      }

      const shouldUseBestSellerSort =
        selectedCategoryId === 'BestSellers' || selectedProductSort === 'best_sellers';

      const productsResult = shouldUseBestSellerSort
        ? await productQuery
            .order('best_seller_units_sold', { ascending: false })
            .order('best_seller_revenue', { ascending: false })
            .order('best_seller_order_count', { ascending: false })
            .order('best_seller_latest_sale_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false })
            .range(fromRow, toRow)
        : selectedProductSort === 'price_low_high'
          ? await productQuery
              .order('app_price', { ascending: true })
              .order('best_seller_units_sold', { ascending: false })
              .order('created_at', { ascending: false })
              .range(fromRow, toRow)
          : await productQuery
              .order('app_price', { ascending: false })
              .order('best_seller_units_sold', { ascending: false })
              .order('created_at', { ascending: false })
              .range(fromRow, toRow);

      if (productsResult.error) {
        if (!options?.quiet) {
          Alert.alert('Products Error', productsResult.error.message);
        }
        return;
      }

      const loadedProducts = (productsResult.data ?? []) as Product[];
      await loadProductVariantsForProducts(loadedProducts.map((product) => product.id));
      setProducts((currentProducts) => (reset ? loadedProducts : mergeProductRows(currentProducts, loadedProducts)));
      setProductsPage(nextPage);
      setProductResultCount(Number(productsResult.count ?? (reset ? loadedProducts.length : fromRow + loadedProducts.length)));
      setProductsHasMore(
        loadedProducts.length === activePageSize &&
          (productsResult.count === null || productsResult.count === undefined || toRow + 1 < Number(productsResult.count))
      );
    } catch (error) {
      if (!options?.quiet) {
        Alert.alert('Products Error', 'Could not load live products. Please try again.');
      }
    } finally {
      productRefreshInFlightRef.current = false;
      setProductsLoadingPage(false);
      setProductsLoadingMore(false);
    }
  }

  async function loadMoreProducts() {
    if (productsLoadingMore || productsLoadingPage || !productsHasMore) return;
    await loadProductsPage({ reset: false, quiet: true });
  }

  async function refreshLoadedProductStockOnly() {
    const productIds: string[] = Array.from(new Set<string>([...products, ...cartProductSnapshots].map((product) => product.id))).slice(0, 250);
    if (productIds.length === 0) return;

    const stockResult = await supabase
      .from('products')
      .select('id,quantity_in_stock,product_status,app_price,vendor_price,product_free_delivery_enabled,product_free_delivery_min_order')
      .in('id', productIds);

    if (stockResult.error) return;

    await loadProductVariantsForProducts(productIds);

    const stockById = new Map<string, Partial<Product>>(
      (stockResult.data ?? []).map((productRow: any) => [productRow.id, productRow as Partial<Product>])
    );

    setProducts((currentProducts) =>
      currentProducts
        .map((product) => ({ ...product, ...(stockById.get(product.id) ?? {}) }))
        .filter((product) => product.product_status === 'live' && Number(product.quantity_in_stock ?? 0) > 0)
    );

    setCartProductSnapshots((currentProducts) =>
      currentProducts.map((product) => ({ ...product, ...(stockById.get(product.id) ?? {}) }))
    );
  }

  async function quietRefreshStaticMarketplaceData() {
    try {
      const [categoriesResult, retailersResult, bannersResult, subcategoriesResult] = await Promise.all([
        supabase.from('categories').select('*').order('name', { ascending: true }),
        supabase
          .from('retailers')
          .select('id,business_name,retailer_number,phone,status')
          .order('business_name', { ascending: true }),
        supabase
          .from('active_customer_ad_banners')
          .select('*')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false }),
        supabase
          .from('marketplace_category_subcategories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
      ]);

      if (!categoriesResult.error) {
        setCategories((categoriesResult.data ?? []) as Category[]);
      }

      if (!retailersResult.error) {
        setRetailers((retailersResult.data ?? []) as Retailer[]);
      }

      if (!bannersResult.error) {
        setCustomerAdBanners((bannersResult.data ?? []) as CustomerAdBanner[]);
      }

      if (!subcategoriesResult.error) {
        setMarketplaceCategorySubcategories((subcategoriesResult.data ?? []) as MarketplaceCategorySubcategory[]);
      }
    } catch {
      // Static marketplace refresh should never interrupt the customer.
    }
  }

  async function loadFreshCartProductsForCheckout() {
    const cartProductIds: string[] = Array.from(new Set<string>(cartItems.map((cartItem) => getCartProductId(cartItem))));
    if (cartProductIds.length === 0) return mergeProductRows(products, cartProductSnapshots);

    const cartProductsResult = await supabase
      .from('products')
      .select('*')
      .in('id', cartProductIds);

    if (cartProductsResult.error) {
      Alert.alert('Cart Error', cartProductsResult.error.message);
      return null;
    }

    const freshCartProducts = (cartProductsResult.data ?? []) as Product[];
    await loadProductVariantsForProducts(cartProductIds);
    setCartProductSnapshots((currentProducts) => mergeProductRows(currentProducts, freshCartProducts));
    setProducts((currentProducts) => mergeProductRows(currentProducts, freshCartProducts));

    return mergeProductRows(mergeProductRows(products, cartProductSnapshots), freshCartProducts);
  }

  async function loadCustomerData() {
    setLoading(true);

    const [categoriesResult, retailersResult, bannersResult, subcategoriesResult] = await Promise.all([
      supabase.from('categories').select('*').order('name', { ascending: true }),
      supabase
        .from('retailers')
        .select('id,business_name,retailer_number,phone,status')
        .order('business_name', { ascending: true }),
      supabase
        .from('active_customer_ad_banners')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
      supabase
        .from('marketplace_category_subcategories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true }),
    ]);

    if (categoriesResult.error) {
      Alert.alert('Categories Error', categoriesResult.error.message);
      setLoading(false);
      return;
    }

    if (retailersResult.error) {
      Alert.alert('Retailers Error', retailersResult.error.message);
      setLoading(false);
      return;
    }

    setCategories((categoriesResult.data ?? []) as Category[]);
    setRetailers((retailersResult.data ?? []) as Retailer[]);
    setMarketplaceCategorySubcategories(
      subcategoriesResult.error ? [] : ((subcategoriesResult.data ?? []) as MarketplaceCategorySubcategory[])
    );
    setCustomerAdBanners(
      bannersResult.error ? [] : ((bannersResult.data ?? []) as CustomerAdBanner[])
    );

    await loadProductsPage({ reset: true });

    if (customerProfile?.id) {
      await loadCustomerOrders(customerProfile.id);
      await loadCustomerSavedLocations(customerProfile.id);
    }
    setLoading(false);
  }

  async function quietRefreshCustomerApp(profileId?: string | null) {
    if (quietRefreshInFlightRef.current) return;

    quietRefreshInFlightRef.current = true;

    try {
      if (!profileId) return;

      const [profileResult, ordersResult] = await Promise.all([
        supabase.from('customers').select('*').eq('id', profileId).maybeSingle(),
        supabase
          .from('orders')
          .select('*')
          .eq('customer_id', profileId)
          .in('order_status', CUSTOMER_VISIBLE_ORDER_STATUSES)
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (!profileResult.error && profileResult.data) {
        setCustomerProfile(profileResult.data as CustomerProfile);
      }

      if (!ordersResult.error) {
        const loadedOrders = (ordersResult.data ?? []) as CustomerOrder[];
        setCustomerOrders(loadedOrders);

        const orderIds = loadedOrders.map((order) => order.id);

        if (orderIds.length === 0) {
          setCustomerOrderItems([]);
          setCancellationRequests([]);
          setDarikReturnRequests([]);
        } else {
          const [itemsResult, cancellationRequestsResult, returnsResult] = await Promise.all([
            supabase
              .from('order_items')
              .select('*')
              .in('order_id', orderIds)
              .order('created_at', { ascending: true }),
            supabase
              .from('customer_order_cancellation_requests')
              .select('*')
              .in('order_id', orderIds)
              .order('requested_at', { ascending: false }),
            supabase
              .from('darik_return_requests')
              .select('*')
              .in('order_id', orderIds)
              .order('requested_at', { ascending: false }),
          ]);

          if (!itemsResult.error) {
            setCustomerOrderItems((itemsResult.data ?? []) as CustomerOrderItem[]);
          }

          if (!cancellationRequestsResult.error) {
            setCancellationRequests((cancellationRequestsResult.data ?? []) as CustomerCancellationRequest[]);
          }

          if (!returnsResult.error) {
            setDarikReturnRequests((returnsResult.data ?? []) as DarikReturnRequest[]);
          }
        }
      }

      await loadCustomerReturnAllowance(profileId);
    } catch {
      // Quiet refresh must never interrupt the customer with alerts.
    } finally {
      quietRefreshInFlightRef.current = false;
    }
  }

  useEffect(() => {
    if (signupCodeCooldownSeconds <= 0) return;

    const timer = setTimeout(() => {
      setSignupCodeCooldownSeconds((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [signupCodeCooldownSeconds]);

  function t(key: DarikTranslationKey) {
    return DARIK_TRANSLATIONS[key]?.[appLanguage] ?? DARIK_TRANSLATIONS[key]?.en ?? key;
  }

  function getLocalizedWeekdayName(date: Date) {
    return date.toLocaleDateString(appLanguage === 'ar' ? 'ar-JO' : 'en-US', { weekday: 'long' });
  }

  function getLocalizedDynamicDeliveryEtaLabel(option: DeliveryOptionType, now: Date) {
    const beforeCutoff = isBeforeDeliveryCutoff(now);

    if (option === 'express_2hr') {
      if (beforeCutoff) {
        return t('deliveredTodayUnder2Hours');
      }

      const targetDate = addCalendarDays(now, 1);
      return `${t('after8PmDeliveredTomorrow')} (${getLocalizedWeekdayName(targetDate)})`;
    }

    const targetDate = addCalendarDays(now, beforeCutoff ? 1 : 2);

    if (beforeCutoff) {
      return `${t('deliveredTomorrow')} (${getLocalizedWeekdayName(targetDate)})`;
    }

    return `${t('after8PmDelivered')} ${getLocalizedWeekdayName(targetDate)}`;
  }

  function translateStaticCategoryName(name: string | null | undefined) {
    const translationKey = getDarikCategoryTranslationKey(name);
    return translationKey ? t(translationKey) : String(name ?? '').trim();
  }

  function getCategoryDisplayName(category: Category | null | undefined) {
    if (!category) return t('categoryWord');

    const approvedArabicName = String(category.official_marketplace_name_ar ?? '').trim();
    if (appLanguage === 'ar' && approvedArabicName.length > 0) {
      return approvedArabicName;
    }

    return translateStaticCategoryName(category.name) || category.name;
  }

  function getLocalizedCategoryMicroCopy(categoryName: string | null | undefined) {
    const normalized = normalizeCategoryName(categoryName);

    if (
      normalized === 'clothing' ||
      normalized === 'clothes' ||
      normalized === 'fashion' ||
      normalized === 'apparel'
    ) {
      return t('categoryMicroSizesReady');
    }

    if (
      normalized === 'baby' ||
      normalized === 'baby items' ||
      normalized === 'baby supplies' ||
      normalized === 'infant' ||
      normalized === 'infant supplies' ||
      normalized.includes('baby')
    ) {
      return t('categoryMicroDailyCare');
    }

    if (
      normalized === 'cosmetics' ||
      normalized === 'cosmetic' ||
      normalized === 'beauty' ||
      normalized === 'beauty supplies' ||
      normalized === 'skincare' ||
      normalized === 'skin care' ||
      normalized === 'makeup' ||
      normalized.includes('cosmetic') ||
      normalized.includes('beauty')
    ) {
      return t('categoryMicroBeautyPicks');
    }

    if (
      normalized === 'pets' ||
      normalized === 'pet' ||
      normalized === 'pet items' ||
      normalized === 'pet supplies' ||
      normalized === 'animals' ||
      normalized.includes('pet')
    ) {
      return t('categoryMicroPetEssentials');
    }

    if (
      normalized === 'auto emergency' ||
      normalized === 'auto emergencies' ||
      normalized === 'car emergency' ||
      normalized === 'car emergencies'
    ) {
      return t('categoryMicroRoadReady');
    }

    return t('categoryMicroLiveItems');
  }

  async function changeCustomerLanguage(nextLanguage: AppLanguage) {
    setAppLanguage(nextLanguage);
    await AsyncStorage.setItem(DARIK_CUSTOMER_LANGUAGE_KEY, nextLanguage);
  }

  function toggleCustomerLanguage() {
    changeCustomerLanguage(appLanguage === 'en' ? 'ar' : 'en').catch(() => {});
  }

  function renderLanguageToggle(theme: 'dark' | 'light' = 'dark') {
    const darkTheme = theme === 'dark';

    return (
      <TouchableOpacity
        style={darkTheme ? styles.languageToggleDark : styles.languageToggleLight}
        onPress={toggleCustomerLanguage}
        activeOpacity={0.85}
      >
        <Text style={darkTheme ? styles.languageToggleDarkText : styles.languageToggleLightText}>
          {appLanguage === 'en' ? t('switchToArabic') : t('switchToEnglish')}
        </Text>
      </TouchableOpacity>
    );
  }

  async function openCustomerOrderHistoryFromMenu() {
    setCustomerOtherOptionsVisible(false);
    setSelectedCustomerOrder(null);
    setOrderDetailVisible(false);
    await loadCustomerOrders(customerProfile?.id);
    setOrdersVisible(true);
  }

  function openCustomerSupportFromMenu() {
    setCustomerOtherOptionsVisible(false);
    openSupportCenter();
  }

  function openCustomerChangePasswordFromMenu() {
    setCustomerOtherOptionsVisible(false);
    setNewCustomerPassword('');
    setConfirmCustomerPassword('');
    setChangePasswordVisible(true);
  }

  async function handleCustomerChangePassword() {
    const cleanedPassword = newCustomerPassword.trim();
    const cleanedConfirmPassword = confirmCustomerPassword.trim();

    if (cleanedPassword.length < 6) {
      Alert.alert(t('changeYourPassword'), t('passwordTooShort'));
      return;
    }

    if (cleanedPassword !== cleanedConfirmPassword) {
      Alert.alert(t('changeYourPassword'), t('passwordsDoNotMatch'));
      return;
    }

    setChangePasswordBusy(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: cleanedPassword,
      });

      if (error) {
        Alert.alert(t('changeYourPassword'), error.message);
        return;
      }

      setNewCustomerPassword('');
      setConfirmCustomerPassword('');
      setChangePasswordVisible(false);
      Alert.alert(t('changeYourPassword'), t('passwordUpdated'));
    } finally {
      setChangePasswordBusy(false);
    }
  }

  useEffect(() => {
    AsyncStorage.getItem(DARIK_CUSTOMER_LANGUAGE_KEY)
      .then((storedLanguage) => {
        if (storedLanguage === 'ar' || storedLanguage === 'en') {
          setAppLanguage(storedLanguage);
        }
      })
      .catch(() => {});

    initializeCustomerSession();
    loadPersistentCartData();
  }, []);

  useEffect(() => {
    const deliveryClockTimer = setInterval(() => {
      setCurrentDeliveryTime(new Date());
    }, 60000);

    return () => clearInterval(deliveryClockTimer);
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const quietRefreshTimer = setInterval(() => {
      quietRefreshCustomerApp(customerProfile?.id).catch(() => {});
    }, QUIET_CUSTOMER_REFRESH_MS);

    return () => clearInterval(quietRefreshTimer);
  }, [authLoading, customerProfile?.id]);

  const categoryById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const selectedCategoryName =
    selectedCategoryId === 'All' || selectedCategoryId === 'BestSellers'
      ? ''
      : categoryById.get(selectedCategoryId)?.name ?? '';

  const selectedCategoryCode = normalizeMarketplaceCategoryCode(selectedCategoryName);

  const selectedCategorySubcategoryRows = useMemo(() => {
    if (!selectedCategoryCode) return [];

    return marketplaceCategorySubcategories.filter((row) => {
      const rowCategoryCode = normalizeMarketplaceCategoryCode(row.category_code || row.department_code || row.category_name_match || '');
      const rowCategoryName = normalizeMarketplaceCategoryCode(row.category_name_match || '');
      return rowCategoryCode === selectedCategoryCode || rowCategoryName === selectedCategoryCode;
    });
  }, [marketplaceCategorySubcategories, selectedCategoryCode]);

  const selectedCategoryHasDatabaseSubcategories = selectedCategorySubcategoryRows.length > 0;

  const selectedCategoryIsClothing =
    isClothingCategoryName(selectedCategoryName) || selectedCategoryHasDatabaseSubcategories;

  const activeCategoryDepartmentOptions = useMemo(() => {
    if (selectedCategoryHasDatabaseSubcategories) {
      const departmentMap = new Map<string, ClothingMarketplaceOption>();

      selectedCategorySubcategoryRows.forEach((row) => {
        const departmentId = row.department_code || selectedCategoryCode;
        if (!departmentId) return;

        if (!departmentMap.has(departmentId)) {
          departmentMap.set(departmentId, {
            id: departmentId,
            en: row.department_name_en || selectedCategoryName || departmentId,
            ar: row.department_name_ar || row.department_name_en || selectedCategoryName || departmentId,
          });
        }
      });

      if (departmentMap.size > 0) return Array.from(departmentMap.values());

      if (selectedCategoryCode) {
        return [
          {
            id: selectedCategoryCode,
            en: selectedCategoryName || selectedCategoryCode,
            ar: selectedCategoryName || selectedCategoryCode,
          },
        ];
      }
    }

    return FALLBACK_FALLBACK_CLOTHING_DEPARTMENT_OPTIONS;
  }, [
    selectedCategoryCode,
    selectedCategoryHasDatabaseSubcategories,
    selectedCategoryName,
    selectedCategorySubcategoryRows,
  ]);

  const selectedCategoryHasMultipleDepartmentChoices =
    selectedCategoryHasDatabaseSubcategories && activeCategoryDepartmentOptions.length > 1;

  const selectedCategoryFilterLabel =
    selectedCategoryCode === 'baby'
      ? appLanguage === 'ar'
        ? 'نوع البيبي'
        : 'Baby Type'
      : selectedCategoryHasDatabaseSubcategories
        ? t('subcategories')
        : t('clothingDepartment');

  const selectedSubcategoryFilterLabel =
    selectedCategoryCode === 'baby'
      ? appLanguage === 'ar'
        ? 'نوع المنتج'
        : 'Baby Item Type'
      : selectedCategoryHasDatabaseSubcategories
        ? t('subcategories')
        : t('clothingType');

  const activeCategorySubcategoryOptions = useMemo(() => {
    if (selectedCategoryHasDatabaseSubcategories) {
      const rowsForDepartment =
        selectedCategoryHasMultipleDepartmentChoices && selectedClothingDepartment !== 'All'
          ? selectedCategorySubcategoryRows.filter((row) => row.department_code === selectedClothingDepartment)
          : !selectedCategoryHasMultipleDepartmentChoices && selectedClothingDepartment !== 'All'
            ? selectedCategorySubcategoryRows.filter((row) => row.department_code === selectedClothingDepartment)
            : selectedCategorySubcategoryRows;

      const itemTypeMap = new Map<string, ClothingMarketplaceOption>();

      rowsForDepartment.forEach((row) => {
        if (!row.item_type_code || itemTypeMap.has(row.item_type_code)) return;

        itemTypeMap.set(row.item_type_code, {
          id: row.item_type_code,
          en: row.item_type_name_en || row.item_type_code,
          ar: row.item_type_name_ar || row.item_type_name_en || row.item_type_code,
        });
      });

      return Array.from(itemTypeMap.values());
    }

    return FALLBACK_FALLBACK_CLOTHING_ITEM_TYPE_OPTIONS;
  }, [
    selectedCategoryHasDatabaseSubcategories,
    selectedCategoryHasMultipleDepartmentChoices,
    selectedCategorySubcategoryRows,
    selectedClothingDepartment,
  ]);

  const bestSellerDepartments = useMemo(() => {
    const categoryIdsWithProducts = new Set(
      products
        .map((product) => product.category_id)
        .filter((categoryId): categoryId is string => Boolean(categoryId))
    );

    // Keep Best Sellers category rows in the same Darik category order.
    // Actual sales ranking is applied inside each category row by the product query order.
    return sortBestSellerDepartments(categories).filter((category) => categoryIdsWithProducts.has(category.id));
  }, [categories, products]);

  const visibleBestSellerDepartments = bestSellerDepartments.slice(0, bestSellerVisibleCategoryCount);


  useEffect(() => {
    if (selectedCategoryId === 'BestSellers') {
      bestSellerUserScrolledDownRef.current = false;
      setBestSellerVisibleCategoryCount(BEST_SELLER_INITIAL_CATEGORY_COUNT);
      setBestSellerPageByCategoryId({});
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (loading) return;

    if (productSearchDebounceRef.current) {
      clearTimeout(productSearchDebounceRef.current);
    }

    productSearchDebounceRef.current = setTimeout(() => {
      loadProductsPage({ reset: true, quiet: true }).catch(() => {});
    }, 350);

    return () => {
      if (productSearchDebounceRef.current) {
        clearTimeout(productSearchDebounceRef.current);
      }
    };
  }, [
    searchText,
    selectedCategoryId,
    selectedClothingDepartment,
    selectedClothingItemType,
    selectedRetailerId,
    selectedCategoryHasDatabaseSubcategories,
    selectedProductSort,
  ]);

  useEffect(() => {
    if (!selectedCategoryIsClothing) {
      setSelectedClothingDepartment('All');
      setSelectedClothingItemType('All');
      return;
    }

    if (selectedCategoryHasDatabaseSubcategories) {
      if (selectedCategoryHasMultipleDepartmentChoices) {
        const selectedDepartmentStillExists =
          selectedClothingDepartment === 'All' ||
          activeCategoryDepartmentOptions.some((department) => department.id === selectedClothingDepartment);

        if (!selectedDepartmentStillExists) {
          setSelectedClothingDepartment('All');
          setSelectedClothingItemType('All');
        }

        return;
      }

      const defaultDepartment = activeCategoryDepartmentOptions[0]?.id || selectedCategoryCode;

      if (defaultDepartment && selectedClothingDepartment !== defaultDepartment) {
        setSelectedClothingDepartment(defaultDepartment);
        setSelectedClothingItemType('All');
      }
    }
  }, [
    selectedCategoryIsClothing,
    selectedCategoryHasDatabaseSubcategories,
    selectedCategoryHasMultipleDepartmentChoices,
    selectedCategoryCode,
    selectedClothingDepartment,
    activeCategoryDepartmentOptions,
  ]);

  useEffect(() => {
    if (authLoading) return;

    const stockRefreshTimer = setInterval(() => {
      refreshLoadedProductStockOnly().catch(() => {});
    }, QUIET_PRODUCT_STOCK_REFRESH_MS);

    return () => clearInterval(stockRefreshTimer);
  }, [authLoading, products.length, cartProductSnapshots.length]);

  useEffect(() => {
    if (authLoading) return;

    const staticRefreshTimer = setInterval(() => {
      quietRefreshStaticMarketplaceData().catch(() => {});
    }, QUIET_STATIC_MARKETPLACE_REFRESH_MS);

    return () => clearInterval(staticRefreshTimer);
  }, [authLoading]);

  useEffect(() => {
    if (!supportVisible || !customerProfile?.id || supportBusy) return;

    const supportRefreshTimer = setInterval(() => {
      loadCustomerSupport(customerProfile.id).catch(() => {});
    }, 7000);

    return () => clearInterval(supportRefreshTimer);
  }, [supportVisible, customerProfile?.id, supportBusy]);

  useEffect(() => {
    if (!cartStorageReady) return;
    AsyncStorage.setItem(DARIK_CART_STORAGE_KEY, JSON.stringify(cartItems)).catch(() => {});
  }, [cartItems, cartStorageReady]);

  useEffect(() => {
    if (!cartStorageReady) return;
    AsyncStorage.setItem(DARIK_SAVED_FOR_LATER_STORAGE_KEY, JSON.stringify(savedForLaterItems)).catch(() => {});
  }, [savedForLaterItems, cartStorageReady]);

  async function loadPersistentCartData() {
    try {
      const [cartText, savedForLaterText] = await Promise.all([
        AsyncStorage.getItem(DARIK_CART_STORAGE_KEY),
        AsyncStorage.getItem(DARIK_SAVED_FOR_LATER_STORAGE_KEY),
      ]);

      if (cartText) {
        const parsedCart = JSON.parse(cartText);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart as CartItem[]);
        }
      }

      if (savedForLaterText) {
        const parsedSavedForLater = JSON.parse(savedForLaterText);
        if (Array.isArray(parsedSavedForLater)) {
          setSavedForLaterItems(parsedSavedForLater as CartItem[]);
        }
      }
    } catch {
      // If saved cart storage is corrupted, keep app usable.
    } finally {
      setCartStorageReady(true);
    }
  }

  async function initializeCustomerSession() {
    try {
      setAuthLoading(true);
      const savedRemember = await AsyncStorage.getItem(CUSTOMER_REMEMBER_KEY);
      const shouldRemember = savedRemember === 'true';
      setRememberMe(shouldRemember);

      if (!shouldRemember) {
        await supabase.auth.signOut();
        setCustomerSession(null);
        setCustomerProfile(null);
        setCustomerOrders([]);
        setCustomerOrderItems([]);
        setSavedLocations([]);
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        setCustomerSession(data.session);
        const profile = await ensureCustomerProfile(data.session.user);
        if (profile?.id) {
          await loadCustomerOrders(profile.id);
          await loadCustomerSavedLocations(profile.id);
          await loadCustomerSupport(profile.id);
        }
        await loadCustomerData();
        return;
      }

      setCustomerSession(null);
      setCustomerProfile(null);
      setLoading(false);
    } catch (error) {
      setCustomerSession(null);
      setCustomerProfile(null);
      setLoading(false);
    } finally {
      setAuthLoading(false);
    }
  }

  async function ensureCustomerProfile(user: User, fallbackName?: string, fallbackPhone?: string) {
    const email = user.email ?? '';

    const existingResult = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (existingResult.error) {
      Alert.alert('Customer Profile Error', existingResult.error.message);
      return null;
    }

    if (existingResult.data) {
      const profile = existingResult.data as CustomerProfile;
      setCustomerProfile(profile);
      setCustomerName(profile.full_name ?? fallbackName ?? '');
      setCustomerPhone(profile.phone ?? fallbackPhone ?? '');
      await loadCustomerOrders(profile.id);
      await loadCustomerSavedLocations(profile.id);
      await loadCustomerSupport(profile.id);
      return profile;
    }

    const newProfileResult = await supabase
      .from('customers')
      .insert({
        auth_user_id: user.id,
        email,
        full_name: fallbackName?.trim() || email,
        phone: fallbackPhone?.trim() || '',
      })
      .select('*')
      .single();

    if (newProfileResult.error) {
      const rpcResult = await supabase.rpc('customer_ensure_profile_v1', {
        p_email: email,
        p_full_name: fallbackName?.trim() || email,
        p_phone: fallbackPhone?.trim() || '',
      });

      if (!rpcResult.error && rpcResult.data) {
        const rpcRow = Array.isArray(rpcResult.data) ? rpcResult.data[0] : rpcResult.data;
        const profileFromRpc = ((rpcRow as any)?.profile ?? rpcRow) as CustomerProfile;

        setCustomerProfile(profileFromRpc);
        setCustomerName(profileFromRpc.full_name ?? fallbackName ?? '');
        setCustomerPhone(profileFromRpc.phone ?? fallbackPhone ?? '');
        await loadCustomerOrders(profileFromRpc.id);
        await loadCustomerSavedLocations(profileFromRpc.id);
        return profileFromRpc;
      }

      Alert.alert('Customer Signup Error', rpcResult.error?.message || newProfileResult.error.message);
      return null;
    }

    const profile = newProfileResult.data as CustomerProfile;
    setCustomerProfile(profile);
    setCustomerName(profile.full_name ?? fallbackName ?? '');
    setCustomerPhone(profile.phone ?? fallbackPhone ?? '');
    await loadCustomerOrders(profile.id);
    await loadCustomerSavedLocations(profile.id);
    return profile;
  }

  async function handleCustomerPasswordResetRequest() {
    const email = passwordResetEmail.trim().toLowerCase() || loginEmail.trim().toLowerCase();

    if (!email) {
      Alert.alert('Reset Password', 'Enter your Darik account email first.');
      return;
    }

    try {
      setPasswordResetBusy(true);
      setPasswordResetSent(false);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://getdarik.com/?password-reset=1',
      });

      if (error) {
        Alert.alert('Reset Password Error', error.message);
        return;
      }

      setPasswordResetEmail(email);
      setPasswordResetSent(true);
      Alert.alert(
        'Reset Link Sent',
        'Check your inbox and spam folder. Open the reset link to choose a new password.'
      );
    } finally {
      setPasswordResetBusy(false);
    }
  }

  async function handleCustomerLogin() {
    const email = loginEmail.trim().toLowerCase();

    if (!email || loginPassword.length < 6) {
      Alert.alert('Login Missing', 'Enter your email and password.');
      return;
    }

    try {
      setAuthBusy(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      });

      if (error || !data.session?.user) {
        const message = error?.message ?? 'Could not log in.';

        if (message.toLowerCase().includes('email not confirmed')) {
          Alert.alert(
            'Email Not Confirmed',
            'Supabase email confirmation is turned on. For testing, either confirm the email from the inbox or turn off Confirm email in Supabase > Authentication > Providers > Email.'
          );
          return;
        }

        Alert.alert('Login Error', message);
        return;
      }

      await AsyncStorage.setItem(CUSTOMER_REMEMBER_KEY, rememberMe ? 'true' : 'false');
      setCustomerSession(data.session);
      await ensureCustomerProfile(data.session.user);
      await loadCustomerData();
    } finally {
      setAuthBusy(false);
    }
  }

  function validateCustomerSignupBasics() {
    const email = signupEmail.trim().toLowerCase();
    const name = signupName.trim();
    const phone = signupPhone.trim();
    const confirmPhone = signupPhoneConfirm.trim();

    if (name.length < 2 || phone.length < 8 || confirmPhone.length < 8 || !email || signupPassword.length < 6 || signupPasswordConfirm.length < 6) {
      Alert.alert(
        'Signup Missing',
        'Enter your name, phone twice, email, and password twice. Password must be at least 6 characters.'
      );
      return null;
    }

    if (phone !== confirmPhone) {
      Alert.alert('Phone Numbers Do Not Match', 'Enter the same phone number twice.');
      return null;
    }

    if (signupPassword !== signupPasswordConfirm) {
      Alert.alert('Passwords Do Not Match', 'Enter the same password twice.');
      return null;
    }

    return { email, name, phone };
  }

  async function checkCustomerSignupAvailability(email: string, phone: string) {
    const { data, error } = await supabase.rpc('customer_can_signup_v1', {
      p_email: email,
      p_phone: phone,
    });

    if (error) {
      Alert.alert('Signup Check Error', error.message);
      return false;
    }

    const result = Array.isArray(data) ? data[0] : data;
    const allowed = Boolean((result as any)?.allowed);
    const reason = String((result as any)?.reason || 'This email or phone number is already registered.');

    if (!allowed) {
      Alert.alert('Account Already Exists', reason);
      return false;
    }

    return true;
  }

  async function sendCustomerSignupConfirmationCode() {
    if (signupCodeCooldownSeconds > 0) {
      Alert.alert('Wait Before Resending', `You can resend the confirmation code in ${signupCodeCooldownSeconds} seconds.`);
      return;
    }

    const signupDetails = validateCustomerSignupBasics();
    if (!signupDetails) return;

    try {
      setAuthBusy(true);

      const signupAllowed = await checkCustomerSignupAvailability(signupDetails.email, signupDetails.phone);
      if (!signupAllowed) return;
      const { data, error } = await supabase.auth.signUp({
        email: signupDetails.email,
        password: signupPassword,
        options: {
          data: {
            full_name: signupDetails.name,
            phone: signupDetails.phone,
          },
        },
      });

      if (error || !data.user) {
        const message = String(error?.message ?? 'Could not send confirmation code.');
        const duplicateAccount =
          message.toLowerCase().includes('already') ||
          message.toLowerCase().includes('registered') ||
          message.toLowerCase().includes('exists');

        Alert.alert(
          duplicateAccount ? 'Account Already Exists' : 'Signup Error',
          duplicateAccount ? 'This email is already registered. Please log in instead.' : message
        );
        return;
      }

      await AsyncStorage.setItem(CUSTOMER_REMEMBER_KEY, rememberMe ? 'true' : 'false');

      if (data.session?.user) {
        setCustomerSession(data.session);
        await ensureCustomerProfile(data.session.user, signupDetails.name, signupDetails.phone);
        await loadCustomerData();
        setSignupPassword('');
        setSignupPasswordConfirm('');
        setSignupEmailCode('');
        setSignupConfirmationCodeSent(false);
        setSignupCodeCooldownSeconds(0);
        return;
      }

      setSignupConfirmationCodeSent(true);
      setSignupCodeCooldownSeconds(60);
      Alert.alert(
        'Confirmation Code Sent',
        'Check your email and enter the confirmation code under the email field.'
      );
    } finally {
      setAuthBusy(false);
    }
  }

  async function verifyCustomerSignupCodeAndCreateAccount() {
    const signupDetails = validateCustomerSignupBasics();
    if (!signupDetails) return;

    const token = signupEmailCode.trim();

    if (token.length < 4) {
      Alert.alert('Code Required', 'Enter the confirmation code sent to your email.');
      return;
    }

    try {
      setAuthBusy(true);

      let verifyResult = await supabase.auth.verifyOtp({
        email: signupDetails.email,
        token,
        type: 'signup',
      });

      if (verifyResult.error || !verifyResult.data.session?.user) {
        verifyResult = await supabase.auth.verifyOtp({
          email: signupDetails.email,
          token,
          type: 'email' as any,
        });
      }

      if (verifyResult.error || !verifyResult.data.session?.user) {
        Alert.alert('Confirmation Error', verifyResult.error?.message ?? 'Could not confirm this code.');
        return;
      }

      await AsyncStorage.setItem(CUSTOMER_REMEMBER_KEY, rememberMe ? 'true' : 'false');
      setCustomerSession(verifyResult.data.session);
      await ensureCustomerProfile(verifyResult.data.session.user, signupDetails.name, signupDetails.phone);
      await loadCustomerData();

      setSignupPassword('');
      setSignupPasswordConfirm('');
      setSignupEmailCode('');
      setSignupConfirmationCodeSent(false);
      setSignupCodeCooldownSeconds(0);
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleCustomerSignup() {
    if (signupConfirmationCodeSent) {
      await verifyCustomerSignupCodeAndCreateAccount();
      return;
    }

    await sendCustomerSignupConfirmationCode();
  }

  async function handleCustomerLogout() {
    await AsyncStorage.setItem(CUSTOMER_REMEMBER_KEY, 'false');
    await supabase.auth.signOut();
    setCustomerSession(null);
    setCustomerProfile(null);
    setCartVisible(false);
    setCheckoutVisible(false);
    setOrderPlacedVisible(false);
    setSupportVisible(false);
    setSupportThreads([]);
    setSupportMessages([]);
    setPlacedOrderDeliveryPin('');
    setLastOrderConfirmation(null);
    setLoginPassword('');
    setCustomerOrders([]);
    setCustomerOrderItems([]);
    setCartProductSnapshots([]);
    setDarikReturnRequests([]);
    setCustomerReturnAllowance(getDefaultCustomerReturnAllowance());
    setSavedLocations([]);
  }

  const retailerById = useMemo(() => {
    return new Map(retailers.map((retailer) => [retailer.id, retailer]));
  }, [retailers]);

  const visibleAdBanners = useMemo<CustomerAdBanner[]>(() => {
    const darikPermanentBanner: CustomerAdBanner = {
      id: 'permanent-darik-under-2-hours-banner',
      retailer_id: null,
      banner_status: 'active',
      sponsor_name: 'Darik Marketplace',
      headline: 'Darik Delivery',
      subheadline: 'Essentials delivered fast around Amman.',
      cta_label: 'Refresh Products',
      banner_image_url: null,
      background_color: '#111111',
      text_color: '#FFFFFF',
      accent_color: '#FFD23F',
      sort_order: 9999,
      offer_type: 'none',
      free_delivery_min_order: 0,
      discount_percent: 0,
      discount_min_order: 0,
      offer_paid_by_retailer: false,
    };

    return [...customerAdBanners, darikPermanentBanner];
  }, [customerAdBanners]);

  const selectedRetailer = selectedRetailerId ? retailerById.get(selectedRetailerId) ?? null : null;
  const selectedStoreRetailer = selectedStoreRetailerId
    ? retailerById.get(selectedStoreRetailerId) ?? null
    : null;
  const selectedStoreBanner = selectedStoreRetailerId
    ? visibleAdBanners.find((banner) => banner.retailer_id === selectedStoreRetailerId) ?? null
    : null;

  const productsForPricing = useMemo(() => {
    return mergeProductRows(products, cartProductSnapshots);
  }, [products, cartProductSnapshots]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, cartItem) => {
      const product = productsForPricing.find((item) => item.id === getCartProductId(cartItem));
      const unitPrice = product ? getDisplayUnitPrice(product) : cartItem.priceNumber;
      return total + unitPrice * cartItem.quantity;
    }, 0);
  }, [cartItems, productsForPricing, visibleAdBanners]);

  const freeNextDayUnlocked = subtotal >= FREE_NEXT_DAY_MIN_ORDER;
  const freeNextDayAmountNeeded = Math.max(0, FREE_NEXT_DAY_MIN_ORDER - subtotal);

  useEffect(() => {
    // Safety guard:
    // If the customer selected Free Next-Day while the cart was >= 10 JOD,
    // then lowers quantity below 10 JOD, do not let the old free selection stay active.
    // This closes the exploit where checkout could keep showing 0.00 JOD delivery
    // even after the cart stopped qualifying for free next-day delivery.
    if (cartCount > 0 && selectedDeliveryOption === 'next_day_free' && !freeNextDayUnlocked) {
      setSelectedDeliveryOption('');
    }
  }, [cartCount, freeNextDayUnlocked, selectedDeliveryOption]);

  const expressDeliverySponsors = useMemo(() => {
    const productById = new Map<string, Product>(productsForPricing.map((product) => [product.id, product]));
    const sponsors = new Map<
      string,
      {
        retailer_id: string;
        source_type: 'ad_campaign' | 'product';
        source_id: string | null;
        description: string;
      }
    >();

    for (const cartItem of cartItems) {
      const product = productById.get(getCartProductId(cartItem));
      if (!product) continue;

      if (product.product_free_delivery_enabled && !sponsors.has(product.retailer_id)) {
        sponsors.set(product.retailer_id, {
          retailer_id: product.retailer_id,
          source_type: 'product',
          source_id: product.id,
          description: `Free Express Delivery sponsored on ${product.name}`,
        });
      }
    }

    for (const banner of visibleAdBanners) {
      if (!banner.retailer_id) continue;
      const offerType = String(banner.offer_type ?? 'none');
      if (offerType !== 'free_delivery' && offerType !== 'both') continue;

      const retailerHasCartItem = cartItems.some((cartItem) => {
        const product = productById.get(getCartProductId(cartItem));
        return product?.retailer_id === banner.retailer_id;
      });

      if (retailerHasCartItem && !sponsors.has(banner.retailer_id)) {
        sponsors.set(banner.retailer_id, {
          retailer_id: banner.retailer_id,
          source_type: 'ad_campaign',
          source_id: banner.id,
          description: `Free Express Delivery sponsored by ${banner.sponsor_name || 'retailer'}`,
        });
      }
    }

    return Array.from(sponsors.values());
  }, [cartItems, productsForPricing, visibleAdBanners]);

  const expressDeliverySponsorAvailable = cartCount > 0 && expressDeliverySponsors.length > 0;

  const selectedDeliveryConfig = selectedDeliveryOption
    ? {
        ...DELIVERY_OPTIONS[selectedDeliveryOption],
        etaLabel: getDynamicDeliveryEtaLabel(selectedDeliveryOption, currentDeliveryTime),
        description: getDynamicDeliveryDescription(selectedDeliveryOption, currentDeliveryTime),
      }
    : {
        value: '' as DeliveryOptionType,
        label: 'Choose Delivery',
        shortLabel: 'Choose Delivery',
        etaLabel: 'Choose delivery option',
        fee: 0,
        assignedDriverType: 'company' as const,
        description: 'Choose Express Delivery or Free Next-Day Delivery.',
      };
  const selectedDeliveryBaseFee = cartCount > 0 ? selectedDeliveryConfig.fee : 0;
  const freeTomorrowSavings =
    cartCount > 0 && selectedDeliveryOption === 'next_day_free' && freeNextDayUnlocked
      ? EXPRESS_DELIVERY_FEE
      : 0;
  const freeExpressSavings =
    selectedDeliveryOption === 'express_2hr' && expressDeliverySponsorAvailable
      ? EXPRESS_DELIVERY_FEE
      : 0;

  const promotionSummary = useMemo(() => {
    const productById = new Map<string, Product>(productsForPricing.map((product) => [product.id, product]));
    const deductions: {
      retailer_id: string;
      deduction_type: 'discount' | 'free_delivery';
      deduction_amount: number;
      source_type: 'ad_campaign' | 'product';
      source_id: string | null;
      description: string;
    }[] = [];

    for (const banner of visibleAdBanners) {
      if (!banner.retailer_id) continue;

      const offerType = String(banner.offer_type ?? 'none');
      const discountPercent = Number(banner.discount_percent ?? 0);
      const discountMinOrder = Number(banner.discount_min_order ?? 0);

      if (offerType !== 'discount' && offerType !== 'both') continue;
      if (discountPercent <= 0) continue;

      const retailerSubtotal = cartItems.reduce((totalValue, cartItem) => {
        const product = productById.get(getCartProductId(cartItem));
        if (!product || product.retailer_id !== banner.retailer_id) return totalValue;
        return totalValue + getCustomerPrice(product) * cartItem.quantity;
      }, 0);

      if (retailerSubtotal < discountMinOrder) continue;

      // Cart savings must match what customers see item-by-item after rounding.
      const discountAmount = cartItems.reduce((discountTotalValue, cartItem) => {
        const product = productById.get(getCartProductId(cartItem));
        if (!product || product.retailer_id !== banner.retailer_id) {
          return discountTotalValue;
        }

        const baseUnitPrice = getCustomerPrice(product);
        const retailerDiscountedUnitPrice = roundMoney(
          getRetailerBasePrice(product) * (1 - discountPercent / 100)
        );
        const saleUnitPrice = getCustomerPriceFromRetailerPrice(retailerDiscountedUnitPrice);
        const unitSavings = Math.max(0, roundMoney(baseUnitPrice - saleUnitPrice));

        return discountTotalValue + unitSavings * cartItem.quantity;
      }, 0);

      const roundedDiscountAmount = Number(discountAmount.toFixed(2));

      if (roundedDiscountAmount > 0) {
        deductions.push({
          retailer_id: banner.retailer_id,
          deduction_type: 'discount',
          deduction_amount: roundedDiscountAmount,
          source_type: 'ad_campaign',
          source_id: banner.id,
          description: `${discountPercent}% off ${banner.sponsor_name || 'retailer'} order`,
        });
      }
    }

    if (selectedDeliveryOption === 'express_2hr' && selectedDeliveryBaseFee > 0 && expressDeliverySponsors.length > 0) {
      const evenShare = Number((selectedDeliveryBaseFee / expressDeliverySponsors.length).toFixed(2));
      let allocatedDeliveryFee = 0;

      expressDeliverySponsors.forEach((sponsor, index) => {
        const isLastSponsor = index === expressDeliverySponsors.length - 1;
        const sponsorShare = isLastSponsor
          ? Number((selectedDeliveryBaseFee - allocatedDeliveryFee).toFixed(2))
          : evenShare;

        allocatedDeliveryFee = Number((allocatedDeliveryFee + sponsorShare).toFixed(2));

        deductions.push({
          retailer_id: sponsor.retailer_id,
          deduction_type: 'free_delivery',
          deduction_amount: sponsorShare,
          source_type: sponsor.source_type,
          source_id: sponsor.source_id,
          description:
            expressDeliverySponsors.length > 1
              ? `${sponsor.description} | split ${index + 1} of ${expressDeliverySponsors.length}`
              : sponsor.description,
        });
      });
    }

    const discountTotal = deductions
      .filter((deduction) => deduction.deduction_type === 'discount')
      .reduce((totalValue, deduction) => totalValue + deduction.deduction_amount, 0);

    const retailerDeliverySponsorAmount = deductions
      .filter((deduction) => deduction.deduction_type === 'free_delivery')
      .reduce((totalValue, deduction) => totalValue + deduction.deduction_amount, 0);

    // New delivery strategy:
    // Free next-day delivery is paid/operated by Darik fleet and does not reduce retailer payout.
    // Free Express Delivery is an explicit retailer-sponsored express offer and only applies when the customer chooses Express.
    const customerDeliveryFee = Math.max(0, selectedDeliveryBaseFee - retailerDeliverySponsorAmount);
    const finalTotal = Math.max(0, subtotal + customerDeliveryFee);

    return {
      deductions,
      discountTotal: Number(discountTotal.toFixed(2)),
      retailerDeliverySponsorAmount: Number(retailerDeliverySponsorAmount.toFixed(2)),
      customerDeliveryFee: Number(customerDeliveryFee.toFixed(2)),
      finalTotal: Number(finalTotal.toFixed(2)),
      deliverySponsorDescription:
        retailerDeliverySponsorAmount > 0
          ? expressDeliverySponsors.length === 1
            ? expressDeliverySponsors[0].description
            : `Free Express Delivery split across ${expressDeliverySponsors.length} retailers`
          : '',
    };
  }, [cartItems, productsForPricing, subtotal, visibleAdBanners, selectedDeliveryBaseFee, selectedDeliveryOption, expressDeliverySponsors]);

  const customerDeliveryFee = promotionSummary.customerDeliveryFee;
  const deliveryFee = customerDeliveryFee;
  const promotionDiscountTotal = promotionSummary.discountTotal;
  const retailerDeliverySponsorAmount = promotionSummary.retailerDeliverySponsorAmount;
  const selectedDeliveryDisplayLabel =
    selectedDeliveryOption === 'express_2hr' && retailerDeliverySponsorAmount > 0
      ? 'Free Express Delivery'
      : selectedDeliveryConfig.shortLabel;
  const selectedDeliveryStoredLabel =
    selectedDeliveryOption === 'express_2hr' && retailerDeliverySponsorAmount > 0
      ? 'Free Express Delivery'
      : selectedDeliveryConfig.label;
  const customerOrderSavingsTotal = Number(
    (promotionDiscountTotal + freeTomorrowSavings + freeExpressSavings).toFixed(2)
  );
  const preCreditTotal = promotionSummary.finalTotal;
  const availableDarikCredit = getDarikCreditBalance(customerProfile);
  const darikCreditToApply = Number(Math.min(availableDarikCredit, preCreditTotal).toFixed(2));
  const total = Number(Math.max(0, preCreditTotal - darikCreditToApply).toFixed(2));
  const projectedCreditBalanceAfterOrder = Number(Math.max(0, availableDarikCredit - darikCreditToApply).toFixed(2));

  useEffect(() => {
    if (visibleAdBanners.length <= 1) return;

    const intervalId = setInterval(() => {
      setActiveBannerIndex((currentIndex) => {
        const nextIndex = (currentIndex + 1) % visibleAdBanners.length;

        bannerScrollRef.current?.scrollTo({
          x: nextIndex * HERO_BANNER_WIDTH,
          animated: true,
        });

        return nextIndex;
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [visibleAdBanners.length]);

  // Keep both delivery choices visible. Do not auto-switch the customer away from
  // Free Next-Day Delivery, because they must be able to see and choose the wait-until-tomorrow option.

  const filteredProducts = products;

  const storeProducts = selectedStoreRetailerId
    ? products.filter((product) => product.retailer_id === selectedStoreRetailerId)
    : [];

  const displayedProductCountLabel = productResultCount > 0
    ? `${products.length} of ${productResultCount} items`
    : `${products.length} items`;

  const searchSuggestions =
    searchText.trim().length > 0
      ? products
          .filter((product) => productMatchesCustomerSearch(product, searchText))
          .slice(0, 5)
      : [];

  const deliveryDistanceKm = useMemo(() => {
    if (!deliveryLocation) return null;

    return getDistanceKm(
      DARIK_WAREHOUSE_LATITUDE,
      DARIK_WAREHOUSE_LONGITUDE,
      deliveryLocation.latitude,
      deliveryLocation.longitude
    );
  }, [deliveryLocation]);

  const expressDeliveryWithinRadius =
    deliveryDistanceKm === null || deliveryDistanceKm <= EXPRESS_DELIVERY_RADIUS_KM;
  const nextDayDeliveryWithinRadius =
    deliveryDistanceKm === null || deliveryDistanceKm <= NEXT_DAY_DELIVERY_RADIUS_KM;
  const selectedDeliveryWithinRadius =
    selectedDeliveryOption === 'express_2hr'
      ? expressDeliveryWithinRadius
      : nextDayDeliveryWithinRadius;
  const deliveryCoverageStatusText = deliveryDistanceKm === null
    ? ''
    : deliveryDistanceKm <= EXPRESS_DELIVERY_RADIUS_KM
      ? `You are ${deliveryDistanceKm.toFixed(1)} km from Darik warehouse. Express and Free Next-Day are available.`
      : deliveryDistanceKm <= NEXT_DAY_DELIVERY_RADIUS_KM
        ? `You are ${deliveryDistanceKm.toFixed(1)} km from Darik warehouse. Free Next-Day is available. Express is only available within ${EXPRESS_DELIVERY_RADIUS_KM} km.`
        : `You are ${deliveryDistanceKm.toFixed(1)} km from Darik warehouse. Darik does not deliver to this location yet.`;
  const deliveryCoverageValidationText = deliveryDistanceKm !== null && deliveryDistanceKm > NEXT_DAY_DELIVERY_RADIUS_KM
    ? `Sorry, Darik does not deliver to this location yet. Free Next-Day is available within ${NEXT_DAY_DELIVERY_RADIUS_KM} km of the warehouse.`
    : selectedDeliveryOption === 'express_2hr' && deliveryDistanceKm !== null && deliveryDistanceKm > EXPRESS_DELIVERY_RADIUS_KM
      ? `Express Delivery is only available within ${EXPRESS_DELIVERY_RADIUS_KM} km of the Darik warehouse. Choose Free Next-Day Delivery if your order qualifies.`
      : '';

  const canUseSelectedDeliveryOption =
    Boolean(selectedDeliveryOption) &&
    (selectedDeliveryOption !== 'next_day_free' || freeNextDayUnlocked) &&
    selectedDeliveryWithinRadius;

  const customerAccountRestricted = isCustomerAccountRestricted(customerProfile);
  const customerRestrictionMessage = getCustomerRestrictionMessage(customerProfile);

  const canPlaceOrder =
    !customerAccountRestricted &&
    customerSession !== null &&
    cartItems.length > 0 &&
    customerName.trim().length >= 2 &&
    customerPhone.trim().length >= 8 &&
    deliveryLocation !== null &&
    canUseSelectedDeliveryOption;

  useEffect(() => {
    if (!deliveryLocation || deliveryDistanceKm === null) return;

    if (
      selectedDeliveryOption === 'express_2hr' &&
      deliveryDistanceKm > EXPRESS_DELIVERY_RADIUS_KM &&
      deliveryDistanceKm <= NEXT_DAY_DELIVERY_RADIUS_KM &&
      freeNextDayUnlocked
    ) {
      setSelectedDeliveryOption('');
    }
  }, [deliveryLocation, deliveryDistanceKm, selectedDeliveryOption, freeNextDayUnlocked]);

  function getCategoryName(product: Product) {
    if (!product.category_id) return appLanguage === 'ar' ? 'غير مصنف' : 'Uncategorized';
    const category = categoryById.get(product.category_id);
    return category ? getCategoryDisplayName(category) : t('categoryWord');
  }

  function getCartProductId(item: CartItem) {
    return item.productId || String(item.id).split('::variant::')[0];
  }

  function makeVariantCartKey(productId: string, variantId: string) {
    return `${productId}::variant::${variantId}`;
  }

  function getProductVariants(productId: string | null | undefined) {
    if (!productId) return [];
    return (productVariantsByProductId[productId] ?? [])
      .filter((variant) => !['deleted', 'deleted_by_retailer', 'archived'].includes(String(variant.variant_status ?? 'active')))
      .sort((a, b) => Number(a.size_sort_order ?? 100) - Number(b.size_sort_order ?? 100));
  }

  function productNeedsSizeSelection(product: Product | null | undefined) {
    if (!product) return false;
    const variants = getProductVariants(product.id);
    return Boolean(product.has_size_variants) || variants.length > 0;
  }

  function getSelectedVariant(product: Product | null | undefined) {
    if (!product) return null;
    const variants = getProductVariants(product.id);
    if (variants.length === 0) return null;
    const selectedId = selectedVariantByProductId[product.id];
    return variants.find((variant) => variant.id === selectedId) ?? variants.find((variant) => Number(variant.quantity_in_stock ?? 0) > 0) ?? variants[0];
  }

  function getCartQuantityForProduct(productId: string) {
    return cartItems
      .filter((item) => getCartProductId(item) === productId)
      .reduce((total, item) => total + item.quantity, 0);
  }

  function getCartQuantityForVariant(productId: string, variantId: string) {
    const cartKey = makeVariantCartKey(productId, variantId);
    return cartItems.find((item) => item.id === cartKey)?.quantity ?? 0;
  }

  function getCartLineAvailableStock(item: CartItem) {
    if (item.productVariantId) {
      const variant = getProductVariants(getCartProductId(item)).find((row) => row.id === item.productVariantId);
      return Number(variant?.quantity_in_stock ?? 0);
    }

    const product = productsForPricing.find((row) => row.id === getCartProductId(item));
    return Number(product?.quantity_in_stock ?? 0);
  }

  function cleanOptionalProductText(value: string | null | undefined) {
    return String(value ?? '').trim();
  }

  function getProductArabicTitle(product: Product | null | undefined) {
    if (!product) return '';

    const status = String(product.arabic_title_status ?? '').trim().toLowerCase();
    const arabicTitle = cleanOptionalProductText(product.official_marketplace_name_ar);

    if (status === 'approved' && arabicTitle.length > 0) {
      return arabicTitle;
    }

    return '';
  }

  function getProductDisplayName(product: Product | null | undefined) {
    if (!product) return '';
    if (appLanguage === 'ar') {
      return getProductArabicTitle(product) || product.name;
    }

    return product.name;
  }

  function normalizeCustomerSearchText(value: string | null | undefined) {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  function getClothingDepartmentLabelById(departmentId: string | null | undefined) {
    const department =
      marketplaceCategorySubcategories.find((row) => row.department_code === departmentId) ||
      null;

    if (department) {
      return appLanguage === 'ar'
        ? department.department_name_ar || department.department_name_en
        : department.department_name_en || department.department_name_ar;
    }

    const fallbackDepartment = FALLBACK_FALLBACK_CLOTHING_DEPARTMENT_OPTIONS.find((option) => option.id === departmentId);
    if (!fallbackDepartment) return '';
    return appLanguage === 'ar' ? fallbackDepartment.ar : fallbackDepartment.en;
  }

  function getClothingItemTypeLabelById(itemTypeId: string | null | undefined) {
    const itemType =
      marketplaceCategorySubcategories.find((row) => row.item_type_code === itemTypeId) ||
      null;

    if (itemType) {
      return appLanguage === 'ar'
        ? itemType.item_type_name_ar || itemType.item_type_name_en
        : itemType.item_type_name_en || itemType.item_type_name_ar;
    }

    const fallbackItemType = FALLBACK_FALLBACK_CLOTHING_ITEM_TYPE_OPTIONS.find((option) => option.id === itemTypeId);
    if (!fallbackItemType) return '';
    return appLanguage === 'ar' ? fallbackItemType.ar : fallbackItemType.en;
  }

  function getProductCategoryDisplayLabel(product: Product) {
    const baseCategoryName = getCategoryName(product);
    const cleanSubcategoryName = String(product.subcategory_name ?? '').trim();

    if (cleanSubcategoryName) {
      const shortSubcategoryName = cleanSubcategoryName.includes('>')
        ? cleanSubcategoryName.split('>').pop()?.trim() || cleanSubcategoryName
        : cleanSubcategoryName;

      const matchedSubcategory = marketplaceCategorySubcategories.find((row) => {
        const rowEnglish = String(row.subcategory_name_en || row.item_type_name_en || '').trim().toLowerCase();
        const rowArabic = String(row.subcategory_name_ar || row.item_type_name_ar || '').trim().toLowerCase();
        const cleanShort = shortSubcategoryName.trim().toLowerCase();
        return cleanShort === rowEnglish || cleanShort === rowArabic;
      });
      const localizedSubcategoryName =
        matchedSubcategory && appLanguage === 'ar'
          ? matchedSubcategory.subcategory_name_ar || matchedSubcategory.item_type_name_ar || shortSubcategoryName
          : matchedSubcategory?.subcategory_name_en || matchedSubcategory?.item_type_name_en || shortSubcategoryName;

      return [baseCategoryName, localizedSubcategoryName].filter(Boolean).join(' • ');
    }

    const categoryIsClothing = isClothingCategoryName(baseCategoryName);

    if (!categoryIsClothing) {
      return baseCategoryName;
    }

    const clothingDepartmentLabel = getClothingDepartmentLabelById(product.clothing_department);
    const clothingItemTypeLabel = getClothingItemTypeLabelById(product.clothing_item_type);

    return [baseCategoryName, clothingDepartmentLabel, clothingItemTypeLabel]
      .filter(Boolean)
      .join(' • ');
  }

  function productMatchesCustomerSearch(product: Product, rawSearchText: string) {
    const normalizedSearch = normalizeCustomerSearchText(rawSearchText);

    if (normalizedSearch.length === 0) {
      return true;
    }

    const approvedArabicTitle = getProductArabicTitle(product);

    const searchableText = [
      product.name,
      product.description,
      getCategoryName(product),
      getProductCategoryDisplayLabel(product),
      getClothingDepartmentLabelById(product.clothing_department),
      getClothingItemTypeLabelById(product.clothing_item_type),
      approvedArabicTitle,
    ]
      .map(normalizeCustomerSearchText)
      .filter(Boolean)
      .join(' ');

    return searchableText.includes(normalizedSearch);
  }

  function getBaseDisplayCartItemName(item: CartItem) {
    if (appLanguage === 'ar' && cleanOptionalProductText(item.arabicName).length > 0) {
      return cleanOptionalProductText(item.arabicName);
    }

    return item.name;
  }

  function getDisplayCartItemName(item: CartItem) {
    const baseName = getBaseDisplayCartItemName(item);
    return item.sizeLabel ? `${baseName} - ${t('sizeWord')} ${item.sizeLabel}` : baseName;
  }

  function getOrderItemDisplayName(item: CustomerOrderItem) {
    const baseName =
      appLanguage === 'ar' && cleanOptionalProductText(item.product_name_ar_snapshot).length > 0
        ? cleanOptionalProductText(item.product_name_ar_snapshot)
        : item.product_name;

    return item.size_label_snapshot ? `${baseName} - ${t('sizeWord')} ${item.size_label_snapshot}` : baseName;
  }

  function getProductRetailerName(product: Product | null) {
    if (!product?.retailer_id) return 'Darik retailer';
    return retailerById.get(product.retailer_id)?.business_name ?? 'Darik retailer';
  }

  function getProductGridPhotoUrl(product: Product | null | undefined) {
    if (!product) return null;

    // 10,000 SKU performance rule:
    // product cards/search/cart should prefer the small thumbnail.
    // Full 1200px official photos are only needed on the product detail screen.
    return (
      product.official_product_thumbnail_url ||
      product.official_product_photo_url ||
      product.retailer_raw_photo_url ||
      null
    );
  }

  function getProductDetailMainPhotoUrl(product: Product | null | undefined) {
    if (!product) return null;
    return product.official_product_photo_url || product.retailer_raw_photo_url || null;
  }

  function getProductDetailImages(product: Product | null) {
    if (!product) return [];

    const images = [
      getProductDetailMainPhotoUrl(product),
      product.official_product_photo_url_2 || product.retailer_raw_photo_url_2 || null,
      product.official_product_photo_url_3 || product.retailer_raw_photo_url_3 || null,
    ].filter((url): url is string => Boolean(url));

    return Array.from(new Set(images));
  }

  function getRetailerCartSubtotal(retailerId: string | null | undefined) {
    if (!retailerId) return 0;

    return cartItems.reduce((totalValue, cartItem) => {
      const product = productsForPricing.find((item) => item.id === getCartProductId(cartItem));
      if (!product || product.retailer_id !== retailerId) return totalValue;
      return totalValue + getCustomerPrice(product) * cartItem.quantity;
    }, 0);
  }

  function getBestDiscountBannerForRetailer(retailerId: string | null | undefined) {
    if (!retailerId) return null;

    return (
      visibleAdBanners
        .filter((banner) => {
          const offerType = String(banner.offer_type ?? 'none');
          return (
            banner.retailer_id === retailerId &&
            (offerType === 'discount' || offerType === 'both') &&
            Number(banner.discount_percent ?? 0) > 0
          );
        })
        .sort((a, b) => Number(b.discount_percent ?? 0) - Number(a.discount_percent ?? 0))[0] ?? null
    );
  }

  function getProductDiscountInfo(product: Product | null | undefined) {
    if (!product) return null;

    const banner = getBestDiscountBannerForRetailer(product.retailer_id);
    if (!banner) return null;

    const discountPercent = Number(banner.discount_percent ?? 0);
    if (discountPercent <= 0) return null;

    const basePrice = getCustomerPrice(product);
    const minOrder = Number(banner.discount_min_order ?? 0);
    const retailerCartSubtotal = getRetailerCartSubtotal(product.retailer_id);
    const qualifies = minOrder <= 0 || retailerCartSubtotal >= minOrder;
    const amountNeeded = qualifies ? 0 : Math.max(0, minOrder - retailerCartSubtotal);
    const retailerBasePrice = getRetailerBasePrice(product);
    const discountedRetailerPrice = roundMoney(retailerBasePrice * (1 - discountPercent / 100));
    const discountedPrice = getCustomerPriceFromRetailerPrice(discountedRetailerPrice);
    const savings = Math.max(0, roundMoney(basePrice - discountedPrice));

    return {
      banner,
      discountPercent,
      basePrice,
      retailerBasePrice,
      discountedRetailerPrice,
      minOrder,
      retailerCartSubtotal,
      qualifies,
      amountNeeded,
      discountedPrice,
      savings,
    };
  }

  function getDisplayUnitPrice(product: Product | null | undefined) {
    const discountInfo = getProductDiscountInfo(product);
    if (discountInfo?.qualifies) return discountInfo.discountedPrice;
    return getCustomerPrice(product);
  }

  function getRetailerPayoutUnitPrice(product: Product | null | undefined) {
    const discountInfo = getProductDiscountInfo(product);
    if (discountInfo?.qualifies) return discountInfo.discountedRetailerPrice;
    return getRetailerBasePrice(product);
  }

  function renderProductPriceBlock(product: Product, variant: 'card' | 'detail' | 'cart' = 'card') {
    const discountInfo = getProductDiscountInfo(product);

    if (discountInfo?.qualifies) {
      return (
        <View
          style={
            variant === 'detail'
              ? styles.discountPriceDetailBlock
              : variant === 'cart'
                ? styles.discountPriceCartBlock
                : styles.discountPriceCardBlock
          }
        >
          <View style={styles.discountPriceRow}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              style={[
                styles.oldPriceText,
                variant === 'detail' && styles.oldPriceTextDetail,
              ]}
            >
              {money(discountInfo.basePrice)} JOD
            </Text>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              style={[
                styles.newPriceText,
                variant === 'detail' && styles.newPriceTextDetail,
              ]}
            >
              {money(discountInfo.discountedPrice)} JOD
            </Text>
          </View>
          <Text style={styles.savingsText}>
            Save {money(discountInfo.savings)} JOD ({money(discountInfo.discountPercent)}% off)
          </Text>
        </View>
      );
    }

    return (
      <View
        style={
          variant === 'detail'
            ? styles.discountPriceDetailBlock
            : variant === 'cart'
              ? styles.discountPriceCartBlock
              : styles.discountPriceCardBlock
        }
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
          style={
            variant === 'detail'
              ? styles.detailPrice
              : variant === 'cart'
                ? styles.cartItemPrice
                : styles.productPrice
          }
        >
          {money(getCustomerPrice(product))} JOD
        </Text>

        {discountInfo && !discountInfo.qualifies && (
          <Text style={styles.discountUnlockText}>
            Add {money(discountInfo.amountNeeded)} JOD to cart to save {money(discountInfo.discountPercent)}%
          </Text>
        )}
      </View>
    );
  }

  function handleAdBannerPress(banner: CustomerAdBanner) {
    if (!banner.retailer_id) {
      loadCustomerData();
      return;
    }

    setSelectedStoreRetailerId(banner.retailer_id);
    setSelectedRetailerId(banner.retailer_id);
    setSelectedCategoryId('All');
    setSearchText('');
    setStorefrontVisible(true);
  }

  function closeStorefront() {
    setStorefrontVisible(false);
    setSelectedRetailerId(null);
    setSelectedStoreRetailerId(null);
  }

  function openStoreProductDetail(product: Product) {
    setStorefrontVisible(false);
    setTimeout(() => {
      openProductDetail(product);
    }, 250);
  }

  function clearRetailerFilter() {
    setSelectedRetailerId(null);
  }

  function getAvailableStock(productId: string) {
    const product = productsForPricing.find((item) => item.id === productId);
    return Number(product?.quantity_in_stock ?? 0);
  }

  function getCartQuantity(productId: string) {
    return getCartQuantityForProduct(productId);
  }

  function showStockLimitMessage(productName: string, availableStock: number) {
    Alert.alert('Stock Limit', `There's only ${availableStock} of ${productName} left.`);
  }

  function addToCart(product: Product, selectedVariant?: ProductVariant | null) {
    const categoryName = getCategoryName(product);
    const needsSize = productNeedsSizeSelection(product);
    const variant = needsSize ? selectedVariant || getSelectedVariant(product) : null;
    const cartKey = variant ? makeVariantCartKey(product.id, variant.id) : product.id;
    const availableStock = variant ? Number(variant.quantity_in_stock ?? 0) : Number(product.quantity_in_stock ?? 0);
    const sizeLabel = variant?.size_label ?? null;

    if (needsSize && !variant) {
      Alert.alert('Choose Size', 'Please choose a size before adding this clothing item to your cart.');
      openProductDetail(product);
      return;
    }

    if (needsSize && availableStock <= 0) {
      Alert.alert('Size Out of Stock', `${sizeLabel || 'This size'} is currently out of stock.`);
      return;
    }

    setCartProductSnapshots((currentProducts) => mergeProductRows(currentProducts, [product]));

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === cartKey);
      const currentQuantity = existingItem?.quantity ?? 0;

      if (currentQuantity + 1 > availableStock) {
        showStockLimitMessage(sizeLabel ? `${getProductDisplayName(product)} ${t('sizeWord')} ${sizeLabel}` : getProductDisplayName(product), availableStock);
        return currentItems;
      }

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === cartKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...currentItems,
        {
          id: cartKey,
          productId: product.id,
          productVariantId: variant?.id ?? null,
          sizeLabel,
          variantSku: variant?.variant_sku ?? null,
          variantWarehouseLocation: variant?.warehouse_location ?? null,
          name: product.name,
          arabicName: getProductArabicTitle(product) || null,
          category: categoryName,
          priceNumber: getDisplayUnitPrice(product),
          quantity: 1,
          photoUrl: getProductGridPhotoUrl(product),
        },
      ];
    });
  }

  function addDetailQuantityToCart(product: Product) {
    const variant = productNeedsSizeSelection(product) ? getSelectedVariant(product) : null;
    const cartKey = variant ? makeVariantCartKey(product.id, variant.id) : product.id;
    const availableStock = variant ? Number(variant.quantity_in_stock ?? 0) : Number(product.quantity_in_stock ?? 0);
    const currentCartQuantity = cartItems.find((item) => item.id === cartKey)?.quantity ?? 0;

    if (productNeedsSizeSelection(product) && !variant) {
      Alert.alert('Choose Size', 'Please choose a size before adding this clothing item to your cart.');
      return;
    }

    if (currentCartQuantity + detailQuantity > availableStock) {
      showStockLimitMessage(variant?.size_label ? `${getProductDisplayName(product)} ${t('sizeWord')} ${variant.size_label}` : getProductDisplayName(product), availableStock);
      return;
    }

    for (let index = 0; index < detailQuantity; index += 1) {
      addToCart(product, variant);
    }
  }



  function openCartFromAnywhere() {
    setProductDetailVisible(false);
    setSelectedProduct(null);
    setTimeout(() => {
      setCartVisible(true);
    }, 120);
  }

  function renderSizeSelector(product: Product) {
    if (!productNeedsSizeSelection(product)) return null;

    const variants = getProductVariants(product.id);
    const selectedVariant = getSelectedVariant(product);

    return (
      <View style={{ marginTop: 16, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#E7E7E7' }}>
        <Text style={{ fontSize: 18, fontWeight: '900', color: '#111111', marginBottom: 5 }}>{t('chooseSize')}</Text>
        <Text style={{ color: '#666666', fontSize: 12, fontWeight: '700', lineHeight: 18, marginBottom: 12 }}>
          Clothing sizes are packed separately in the Darik warehouse. Pick the exact size before adding to cart.
        </Text>

        {variants.length === 0 ? (
          <Text style={{ color: '#991B1B', fontSize: 12, fontWeight: '900' }}>{t('sizesUnavailable')}</Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {variants.map((variant) => {
              const isSelected = selectedVariant?.id === variant.id;
              const stock = Number(variant.quantity_in_stock ?? 0);
              const isOut = stock <= 0;

              return (
                <TouchableOpacity
                  key={variant.id}
                  disabled={isOut}
                  style={{
                    minWidth: 76,
                    borderRadius: 16,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderColor: isSelected ? '#111111' : '#E5E7EB',
                    backgroundColor: isOut ? '#F3F4F6' : isSelected ? '#111111' : '#FFFFFF',
                    opacity: isOut ? 0.55 : 1,
                  }}
                  onPress={() => setSelectedVariantByProductId((current) => ({ ...current, [product.id]: variant.id }))}
                >
                  <Text style={{ color: isSelected ? '#FFD23F' : '#111111', fontSize: 14, fontWeight: '900', textAlign: 'center' }}>
                    {variant.size_label}
                  </Text>
                  <Text style={{ color: isSelected ? '#FFFFFF' : '#6B7280', fontSize: 10, fontWeight: '800', textAlign: 'center', marginTop: 3 }}>
                    {isOut ? 'Out' : `${stock} left`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    );
  }

  function renderProductCardCartAction(product: Product) {
    if (productNeedsSizeSelection(product)) {
      const quantityInCart = getCartQuantity(product.id);
      return (
        <TouchableOpacity
          style={[styles.addButton, styles.chooseSizeButton]}
          onPress={() => openProductDetail(product)}
        >
          <Text
            style={styles.addButtonText}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            {t('add')}
          </Text>
        </TouchableOpacity>
      );
    }

    if (getCartQuantity(product.id) > 0) {
      return (
        <View style={styles.productQuantityControls}>
          <TouchableOpacity style={styles.productQuantityButton} onPress={() => decreaseQuantity(product.id)}>
            <Text style={styles.productQuantityButtonText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.productQuantityText}>{getCartQuantity(product.id)}</Text>

          <TouchableOpacity style={styles.productQuantityButton} onPress={() => addToCart(product)}>
            <Text style={styles.productQuantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(product)}>
        <Text style={styles.addButtonText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{t('add')}</Text>
      </TouchableOpacity>
    );
  }

  function renderProductDetailCartControls(product: Product) {
    const selectedVariant = productNeedsSizeSelection(product) ? getSelectedVariant(product) : null;
    const activeCartKey = selectedVariant ? makeVariantCartKey(product.id, selectedVariant.id) : product.id;
    const currentCartQuantity = selectedVariant ? getCartQuantityForVariant(product.id, selectedVariant.id) : getCartQuantity(product.id);
    const unitPrice = getDisplayUnitPrice(product);
    const addDisabled = productNeedsSizeSelection(product) && (!selectedVariant || Number(selectedVariant.quantity_in_stock ?? 0) <= 0);

    if (currentCartQuantity <= 0) {
      return (
        <View style={styles.detailBottomBar}>
          <View>
            <Text style={styles.detailBottomLabel}>{t('itemPrice')}</Text>
            <Text style={styles.detailBottomPrice}>{money(unitPrice)} JOD</Text>
            {selectedVariant ? (
              <Text style={{ color: '#D1D5DB', fontSize: 12, fontWeight: '800', marginTop: 3 }}>
                Selected size: {selectedVariant.size_label}
              </Text>
            ) : (
              <Text style={{ color: '#D1D5DB', fontSize: 12, fontWeight: '800', marginTop: 3 }}>
                {productNeedsSizeSelection(product) ? 'Choose a size first.' : 'Choose Add to Cart to start your quantity.'}
              </Text>
            )}
          </View>

          <View style={styles.detailBottomActions}>
            <TouchableOpacity
              style={[styles.detailAddButton, addDisabled && { opacity: 0.45 }]}
              disabled={addDisabled}
              onPress={() => addToCart(product, selectedVariant)}
            >
              <Text style={styles.detailAddButtonText}>{productNeedsSizeSelection(product) ? 'Add Selected Size' : 'Add to Cart'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.detailBottomBar}>
        <View>
          <Text style={styles.detailBottomLabel}>{t('addedToCart')}</Text>
          <Text style={styles.detailBottomPrice}>
            {currentCartQuantity} added {selectedVariant ? `| Size ${selectedVariant.size_label}` : ''}
          </Text>
          <Text style={{ color: '#D1D5DB', fontSize: 12, fontWeight: '800', marginTop: 3 }}>
            Cart line total: {money(unitPrice * currentCartQuantity)} JOD
          </Text>
        </View>

        <View style={styles.detailBottomActions}>
          <View style={styles.detailQuantitySelector}>
            <TouchableOpacity style={styles.detailQuantityButton} onPress={() => decreaseQuantity(activeCartKey)}>
              <Text style={styles.detailQuantityButtonText}>-</Text>
            </TouchableOpacity>

            <Text style={styles.detailQuantityText}>{currentCartQuantity}</Text>

            <TouchableOpacity style={styles.detailQuantityButton} onPress={() => increaseQuantity(activeCartKey)}>
              <Text style={styles.detailQuantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.detailAddButton} onPress={openCartFromAnywhere}>
            <Text style={styles.detailAddButtonText}>{t('viewCart')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function increaseQuantity(id: string) {
    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.id !== id) return item;

        const availableStock = getCartLineAvailableStock(item);

        if (item.quantity + 1 > availableStock) {
          showStockLimitMessage(getDisplayCartItemName(item), availableStock);
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      })
    );
  }

  function decreaseQuantity(id: string) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: string) {
    setCartItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  function saveItemForLater(item: CartItem) {
    setSavedForLaterItems((currentItems) => {
      const existingItem = currentItems.find((savedItem) => savedItem.id === item.id);

      if (existingItem) {
        return currentItems.map((savedItem) =>
          savedItem.id === item.id ? { ...savedItem, quantity: savedItem.quantity + item.quantity } : savedItem
        );
      }

      return [...currentItems, item];
    });

    setCartItems((currentItems) => currentItems.filter((cartItem) => cartItem.id !== item.id));
  }

  function removeSavedForLaterItem(id: string) {
    setSavedForLaterItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  function moveSavedItemToCart(item: CartItem) {
    const availableStock = getCartLineAvailableStock(item);
    const currentCartQuantity = cartItems.find((cartItem) => cartItem.id === item.id)?.quantity ?? 0;
    const quantityToMove = Math.min(item.quantity, Math.max(0, availableStock - currentCartQuantity));

    if (quantityToMove <= 0) {
      showStockLimitMessage(getDisplayCartItemName(item), availableStock);
      return;
    }

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantityToMove } : cartItem
        );
      }

      return [...currentItems, { ...item, quantity: quantityToMove }];
    });

    setSavedForLaterItems((currentItems) =>
      currentItems
        .map((savedItem) => (savedItem.id === item.id ? { ...savedItem, quantity: savedItem.quantity - quantityToMove } : savedItem))
        .filter((savedItem) => savedItem.quantity > 0)
    );
  }

  function clearSavedForLater() {
    setSavedForLaterItems([]);
  }

  function renderSavedForLaterSection() {
    if (savedForLaterItems.length === 0) return null;

    return (
      <View style={styles.savedForLaterBox}>
        <View style={styles.savedForLaterHeaderRow}>
          <View>
            <Text style={styles.savedForLaterTitle}>{t('savedForLater')}</Text>
            <Text style={styles.savedForLaterSubtitle}>
              These items stay here until you move or remove them.
            </Text>
          </View>

          <TouchableOpacity onPress={clearSavedForLater}>
            <Text style={styles.savedForLaterClearText}>{t('clear')}</Text>
          </TouchableOpacity>
        </View>

        {savedForLaterItems.map((item) => {
          const savedProduct = productsForPricing.find((product) => product.id === getCartProductId(item));
          const imageUrl =
            savedProduct?.official_product_photo_url ||
            savedProduct?.retailer_raw_photo_url ||
            item.photoUrl ||
            null;

          return (
            <View key={`saved-for-later-${item.id}`} style={styles.savedForLaterItem}>
              <View style={styles.savedForLaterImage}>
                {imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={styles.cartItemImageReal} />
                ) : (
                  <Text style={styles.cartItemImageText}>{shortCode(getBaseDisplayCartItemName(item))}</Text>
                )}
              </View>

              <View style={styles.savedForLaterMiddle}>
                <Text style={styles.savedForLaterItemName}>{getDisplayCartItemName(item)}</Text>
                <Text style={styles.savedForLaterItemMeta}>
                  Qty {item.quantity} | {item.category}
                </Text>
              </View>

              <View style={styles.savedForLaterActions}>
                <TouchableOpacity
                  style={styles.moveToCartButton}
                  onPress={() => moveSavedItemToCart(item)}
                >
                  <Text style={styles.moveToCartButtonText}>{t('moveToCart')}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => removeSavedForLaterItem(item.id)}>
                  <Text style={styles.savedForLaterRemoveText}>{t('remove')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  function clearCart() {
    setCartItems([]);
    setCartVisible(false);
  }

  function openCheckout() {
    if (cartCount > 0 && selectedDeliveryOption === 'next_day_free' && !freeNextDayUnlocked) {
      setSelectedDeliveryOption('');
      Alert.alert(
        'Free Delivery Minimum',
        `Free Next-Day Delivery requires ${money(FREE_NEXT_DAY_MIN_ORDER)} JOD or more. Choose Express Delivery or add ${money(freeNextDayAmountNeeded)} JOD more.`
      );
    }

    setCartVisible(false);
    setCheckoutVisible(true);
  }

  function renderDeliveryOptionCards() {
    return (
      <View style={styles.deliveryOptionStack}>
        {([DELIVERY_OPTIONS.next_day_free, DELIVERY_OPTIONS.express_2hr] as const).map((option) => {
          const selected = selectedDeliveryOption === option.value;
          const optionDistanceLocked =
            deliveryDistanceKm !== null &&
            ((option.value === 'express_2hr' && deliveryDistanceKm > EXPRESS_DELIVERY_RADIUS_KM) ||
              (option.value === 'next_day_free' && deliveryDistanceKm > NEXT_DAY_DELIVERY_RADIUS_KM));
          const optionMinimumLocked = option.value === 'next_day_free' && !freeNextDayUnlocked;
          const optionLocked = optionMinimumLocked || optionDistanceLocked;
          const optionEtaLabel = getDynamicDeliveryEtaLabel(option.value, currentDeliveryTime);
          const optionHasFreeExpressSponsor = option.value === 'express_2hr' && expressDeliverySponsorAvailable;
          const optionDisplayFee = optionHasFreeExpressSponsor ? 0 : option.fee;
          const optionDisplayTitle = optionHasFreeExpressSponsor ? 'Free Express Delivery' : option.label;
          const optionDescription = optionDistanceLocked
            ? option.value === 'express_2hr'
              ? `Express Delivery is available within ${EXPRESS_DELIVERY_RADIUS_KM} km of Darik warehouse. This location is ${deliveryDistanceKm?.toFixed(1)} km away.`
              : `Darik does not deliver to this location yet. Free Next-Day is available within ${NEXT_DAY_DELIVERY_RADIUS_KM} km of the warehouse.`
            : optionMinimumLocked
              ? `Free delivery unlocks at ${money(FREE_NEXT_DAY_MIN_ORDER)} JOD. Add ${money(freeNextDayAmountNeeded)} JOD more, or choose Express Delivery.`
              : optionHasFreeExpressSponsor
                ? `Retailer-sponsored Free Express Delivery is ON for item(s) in your cart. ${optionEtaLabel}.`
                : getDynamicDeliveryDescription(option.value, currentDeliveryTime);

          return (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.deliveryOptionCard,
                selected && styles.deliveryOptionCardActive,
                optionLocked && styles.deliveryOptionCardDisabled,
              ]}
              activeOpacity={0.88}
              onPress={() => {
                if (optionDistanceLocked) {
                  Alert.alert(
                    'Delivery Area Limit',
                    option.value === 'express_2hr'
                      ? `Express Delivery is only available within ${EXPRESS_DELIVERY_RADIUS_KM} km of the Darik warehouse. Your selected location is ${deliveryDistanceKm?.toFixed(1)} km away.`
                      : `Sorry, Darik does not deliver to this location yet. Free Next-Day Delivery is available within ${NEXT_DAY_DELIVERY_RADIUS_KM} km of the Darik warehouse.`
                  );
                  return;
                }

                if (optionMinimumLocked) {
                  Alert.alert(
                    'Free Delivery Minimum',
                    `Free Next-Day Delivery is for orders over ${money(FREE_NEXT_DAY_MIN_ORDER)} JOD. Add ${money(freeNextDayAmountNeeded)} JOD more, or choose Express Delivery for 2.00 JOD.`
                  );
                  return;
                }

                setSelectedDeliveryOption(option.value);
              }}
            >
              <View style={styles.deliveryOptionMainRow}>
                <View style={styles.deliveryOptionTextWrap}>
                  <View style={styles.deliveryOptionTitleRow}>
                    <Text
                      style={[
                        styles.deliveryOptionRadio,
                        selected && styles.deliveryOptionRadioActive,
                      ]}
                    >
                      {selected ? '●' : '○'}
                    </Text>
                    <Text
                      style={[
                        styles.deliveryOptionTitle,
                        selected && styles.deliveryOptionTitleActive,
                        optionLocked && styles.deliveryOptionTextDisabled,
                      ]}
                    >
                      {optionDisplayTitle}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.deliveryOptionSub,
                      selected && styles.deliveryOptionSubActive,
                      optionLocked && styles.deliveryOptionTextDisabled,
                    ]}
                  >
                    {option.value === 'next_day_free'
                      ? `Free tomorrow over ${money(FREE_NEXT_DAY_MIN_ORDER)} JOD | ${optionEtaLabel}`
                      : optionEtaLabel}
                  </Text>
                </View>

                <View style={styles.deliveryOptionPriceWrap}>
                  <Text
                    style={[
                      styles.deliveryOptionPrice,
                      selected && styles.deliveryOptionPriceActive,
                      optionLocked && styles.deliveryOptionTextDisabled,
                    ]}
                  >
                    {optionDisplayFee.toFixed(2)} JOD
                  </Text>
                  <Text
                    style={[
                      styles.deliveryOptionSmallTag,
                      selected && styles.deliveryOptionSmallTagActive,
                      optionLocked && styles.deliveryOptionTextDisabled,
                    ]}
                  >
                    {option.value === 'next_day_free' ? 'Wait & save' : optionHasFreeExpressSponsor ? 'Retailer pays' : 'Today'}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.deliveryOptionDescription,
                  selected && styles.deliveryOptionDescriptionActive,
                  optionLocked && styles.deliveryOptionTextDisabled,
                ]}
              >
                {optionDescription}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  function openProductDetail(product: Product) {
    setSelectedProduct(product);
    setSelectedProductPhotoIndex(0);
    setDetailQuantity(1);
    setProductDetailVisible(true);
    setSearchText('');

    if (Boolean(product.has_size_variants) || getProductVariants(product.id).length === 0) {
      loadProductVariantsForProducts([product.id]).catch(() => {});
    }
  }

  async function useCurrentLocation() {
    try {
      setGettingLocation(true);

      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Location Permission Needed', 'Please allow location access.');
        return;
      }

      const currentPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
      };

      const readableLocationName = await getReadableLocationLabel(coords.latitude, coords.longitude);

      setDeliveryLocation(coords);
      setDeliveryLocationConfirmed(true);
      setManualLatitude(coords.latitude.toFixed(6));
      setManualLongitude(coords.longitude.toFixed(6));
      setDeliveryAddress(buildGpsAddressLabel(coords.latitude, coords.longitude, readableLocationName));
    } catch {
      Alert.alert('Location Error', 'Could not get your current location.');
    } finally {
      setGettingLocation(false);
    }
  }

  async function applyManualDeliveryLocation() {
    const latitude = Number(manualLatitude.trim().replace(',', '.'));
    const longitude = Number(manualLongitude.trim().replace(',', '.'));

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      Alert.alert('Invalid GPS', 'Enter valid latitude and longitude numbers.');
      return;
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      Alert.alert('Invalid GPS', 'Latitude must be between -90 and 90. Longitude must be between -180 and 180.');
      return;
    }

    const readableLocationName = await getReadableLocationLabel(latitude, longitude);
    const coords = { latitude, longitude };
    const nextAddress = buildGpsAddressLabel(latitude, longitude, readableLocationName);

    setDeliveryLocation(coords);
    setDeliveryLocationConfirmed(true);
    setDeliveryAddress(nextAddress);
    Alert.alert('Test Location Set', `Manual GPS set to ${nextAddress}.`);
  }

  function closeSaveLocationModal(shouldReturnToCheckout = true) {
    setSaveLocationVisible(false);
    setSaveLocationLabel('');

    if (shouldReturnToCheckout && returnToCheckoutAfterSaveLocation) {
      setTimeout(() => {
        setCheckoutVisible(true);
        setReturnToCheckoutAfterSaveLocation(false);
      }, 160);
      return;
    }

    setReturnToCheckoutAfterSaveLocation(false);
  }

  function saveCurrentDeliveryLocation() {
    if (!deliveryLocation) {
      Alert.alert('No Location Selected', 'Press Use Current Location first.');
      return;
    }

    if (!customerProfile?.id) {
      Alert.alert('Login Required', 'Please log in before saving a location.');
      return;
    }

    // Important: close checkout first so the save-location modal does not open behind it.
    setSaveLocationLabel('');
    setReturnToCheckoutAfterSaveLocation(true);
    setCheckoutVisible(false);

    setTimeout(() => {
      setSaveLocationVisible(true);
    }, 260);
  }

  async function confirmSaveCurrentDeliveryLocation() {
    if (!deliveryLocation || !customerProfile?.id) {
      Alert.alert('No Location Selected', 'Press Use Current Location first.');
      return;
    }

    const label = saveLocationLabel.trim();

    if (label.length < 2) {
      Alert.alert('Location Name Needed', 'Name this location. Example: Home, Work, Friend\'s House.');
      return;
    }

    try {
      setSavingLocation(true);

      const saveResult = await supabase
        .from('customer_saved_locations')
        .insert({
          customer_id: customerProfile.id,
          label,
          latitude: deliveryLocation.latitude,
          longitude: deliveryLocation.longitude,
          address_details: deliveryAddress || null,
        })
        .select('*')
        .single();

      if (saveResult.error) {
        Alert.alert('Save Location Error', saveResult.error.message);
        return;
      }

      const saved = saveResult.data as SavedCustomerLocation;
      setSavedLocations((current) => [saved, ...current]);
      closeSaveLocationModal(true);
      Alert.alert('Location Saved', `${label} has been saved.`);
    } finally {
      setSavingLocation(false);
    }
  }

  function useSavedDeliveryLocation(location: SavedCustomerLocation) {
    const coords = {
      latitude: Number(location.latitude),
      longitude: Number(location.longitude),
    };

    setDeliveryLocation(coords);
    setDeliveryLocationConfirmed(true);
    setDeliveryAddress(
      location.address_details ||
        `GPS: ${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
    );

    Alert.alert('Location Selected', `${location.label} is now selected for this order.`);
  }

  async function openGoogleMaps() {
    if (!deliveryLocation) {
      Alert.alert('No Location Selected', 'Press Use Current Location first.');
      return;
    }

    const { latitude, longitude } = deliveryLocation;
    const googleMapsAppUrl = `comgooglemaps://?q=${latitude},${longitude}&center=${latitude},${longitude}&zoom=17`;
    const googleMapsWebUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    const canOpenGoogleMapsApp = await Linking.canOpenURL('comgooglemaps://');

    if (canOpenGoogleMapsApp) {
      await Linking.openURL(googleMapsAppUrl);
      return;
    }

    await Linking.openURL(googleMapsWebUrl);
  }

  function getDeliveryMapRegion(location: DeliveryLocation) {
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: DARIK_MAP_LATITUDE_DELTA,
      longitudeDelta: DARIK_MAP_LONGITUDE_DELTA,
    };
  }

  async function updateDeliveryLocationFromMap(latitude: number, longitude: number) {
    const coords = { latitude, longitude };

    setDeliveryLocation(coords);
    setDeliveryLocationConfirmed(true);
    setManualLatitude(latitude.toFixed(6));
    setManualLongitude(longitude.toFixed(6));

    const readableLocationName = await getReadableLocationLabel(latitude, longitude);
    setDeliveryAddress(buildGpsAddressLabel(latitude, longitude, readableLocationName));
  }

  function getRetailerPromotionDeductionMap() {
    const map = new Map<string, number>();

    for (const deduction of promotionSummary.deductions) {
      // Discount is already baked into vendor_price/app_price below.
      // Only retailer-sponsored Free Express Delivery should be deducted from retailer payout receipts here.
      if (deduction.deduction_type !== 'free_delivery') continue;

      map.set(
        deduction.retailer_id,
        (map.get(deduction.retailer_id) ?? 0) + Number(deduction.deduction_amount ?? 0)
      );
    }

    return map;
  }

  function getRetailerPayoutBaseTotals(orderItems: { product: Product; cartItem: CartItem }[]) {
    const map = new Map<string, number>();

    for (const { product, cartItem } of orderItems) {
      // Retailer payout starts from the retailer's own price AFTER retailer-funded discount.
      // Darik's 25% markup is then calculated on top of that discounted retailer price.
      const amount = getRetailerPayoutUnitPrice(product) * cartItem.quantity;
      map.set(product.retailer_id, (map.get(product.retailer_id) ?? 0) + amount);
    }

    return map;
  }


  async function sendDarikOrderReceiptEmail(payload: {
    orderId: string;
    deliveryPin?: string;
    customerEmail?: string | null;
    customerName: string;
    customerPhone: string;
    paymentMethod: string;
    deliveryLabel: string;
    deliveryEtaLabel: string;
    deliveryAddress: string;
    deliveryNote?: string | null;
    subtotal: number;
    deliveryFee: number;
    darikCreditAppliedAmount?: number;
    total: number;
    items: Array<{
      name: string;
      size?: string | null;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;
  }) {
    const accessToken = customerSession?.access_token;

    if (!accessToken || !payload.customerEmail) {
      return;
    }

    try {
      await fetch('https://getdarik.com/api/send-order-receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.warn('Could not send Darik order receipt:', error);
    }
  }

  async function placeOrder() {
    if (placeOrderInFlightRef.current || placingOrder) {
      return;
    }

    placeOrderInFlightRef.current = true;
    setPlacingOrder(true);

    try {
        if (customerAccountRestricted) {
          Alert.alert('Account Restricted', customerRestrictionMessage);
          return;
        }

        if (!selectedDeliveryOption) {
          Alert.alert('Choose Delivery', 'Please choose Express Delivery or Free Next-Day Delivery before placing the order.');
          return;
        }

        // Final server-side-style client guard before insert:
        // Never create an order with 0.00 JOD next-day delivery unless the live cart subtotal
        // still qualifies at the moment the customer presses Place Order.
        if (selectedDeliveryOption === 'next_day_free' && !freeNextDayUnlocked) {
          setSelectedDeliveryOption('');
          Alert.alert(
            'Free Delivery Minimum',
            `Your cart is under ${money(FREE_NEXT_DAY_MIN_ORDER)} JOD, so Free Next-Day Delivery is no longer available. Choose Express Delivery or add ${money(freeNextDayAmountNeeded)} JOD more.`
          );
          return;
        }

        if (!deliveryLocation) return;

        const liveDeliveryDistanceKm = getDistanceKm(
          DARIK_WAREHOUSE_LATITUDE,
          DARIK_WAREHOUSE_LONGITUDE,
          deliveryLocation.latitude,
          deliveryLocation.longitude
        );

        if (liveDeliveryDistanceKm > NEXT_DAY_DELIVERY_RADIUS_KM) {
          Alert.alert(
            'Outside Delivery Area',
            `Sorry, Darik does not deliver to this location yet. Free Next-Day Delivery is available within ${NEXT_DAY_DELIVERY_RADIUS_KM} km of the warehouse.`
          );
          return;
        }

        if (selectedDeliveryOption === 'express_2hr' && liveDeliveryDistanceKm > EXPRESS_DELIVERY_RADIUS_KM) {
          Alert.alert(
            'Express Unavailable',
            `Express Delivery is only available within ${EXPRESS_DELIVERY_RADIUS_KM} km of the Darik warehouse. Your selected location is ${liveDeliveryDistanceKm.toFixed(1)} km away.`
          );
          return;
        }

        if (!canPlaceOrder) return;

        const freshProductsForCheckout = await loadFreshCartProductsForCheckout();
        if (!freshProductsForCheckout) return;

        const orderItems = cartItems
          .map((cartItem) => {
            const product = freshProductsForCheckout.find((item) => item.id === getCartProductId(cartItem));
            if (!product) return null;

            return {
              product,
              cartItem,
            };
          })
          .filter(Boolean) as { product: Product; cartItem: CartItem }[];

        if (orderItems.length !== cartItems.length) {
          Alert.alert('Cart Error', 'One or more cart items are no longer available. Please refresh your cart.');
          return;
        }

        const variantRowsForCheckout = await loadProductVariantsForProducts(orderItems.map(({ product }) => product.id));
        const variantByIdForCheckout = new Map(variantRowsForCheckout.map((variant) => [variant.id, variant]));

        for (const { product, cartItem } of orderItems) {
          if (productNeedsSizeSelection(product) && !cartItem.productVariantId) {
            Alert.alert(t('chooseSize'), `${getProductDisplayName(product)} ${appLanguage === 'ar' ? 'يحتاج اختيار مقاس قبل إتمام الطلب.' : 'needs a selected size before checkout.'}`);
            return;
          }

          if (cartItem.productVariantId) {
            const variant = variantByIdForCheckout.get(cartItem.productVariantId);
            const stock = Number(variant?.quantity_in_stock ?? 0);
            if (!variant || stock < cartItem.quantity) {
              Alert.alert('Size Stock Changed', `Only ${Math.max(0, stock)} of ${getDisplayCartItemName(cartItem)} is available now.`);
              return;
            }
          }
        }

        if (!customerSession?.user) {
          Alert.alert('Login Required', 'Please log in before placing an order.');
          return;
        }

        let activeCustomer = customerProfile;

        if (!activeCustomer) {
          activeCustomer = await ensureCustomerProfile(
            customerSession.user,
            customerName.trim(),
            customerPhone.trim()
          );
        }

        if (!activeCustomer) {
          Alert.alert('Customer Error', 'Could not load your customer profile.');
          return;
        }

        if (isCustomerAccountRestricted(activeCustomer)) {
          setCustomerProfile(activeCustomer);
          Alert.alert('Account Restricted', getCustomerRestrictionMessage(activeCustomer));
          return;
        }

        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_id: activeCustomer.id,
            customer_name: customerName.trim(),
            customer_phone: customerPhone.trim(),
            delivery_latitude: deliveryLocation.latitude,
            delivery_longitude: deliveryLocation.longitude,
            delivery_address_details: deliveryAddress,
            delivery_note: deliveryNote,
            payment_method: paymentMethod.toLowerCase(),
            order_status: 'placed',
            payment_status: 'cash_on_delivery',
            payment_verification_status: null,
            subtotal,
            delivery_fee: deliveryFee,
            driver_delivery_fee_amount: selectedDeliveryConfig.value === 'express_2hr' ? 2 : 0,
            delivery_option: selectedDeliveryConfig.value,
            delivery_label: selectedDeliveryStoredLabel,
            delivery_eta_label: selectedDeliveryConfig.etaLabel,
            assigned_driver_type: selectedDeliveryConfig.assignedDriverType,
            promotion_discount_total: promotionDiscountTotal,
            retailer_delivery_sponsor_amount: retailerDeliverySponsorAmount,
            promotion_note: promotionSummary.deductions.map((item) => item.description).join(' | ') || null,
            pre_credit_total: preCreditTotal,
            darik_credit_applied_amount: 0,
            customer_amount_due: preCreditTotal,
            total: preCreditTotal,
          })
          .select()
          .single();

        if (orderError) {
          Alert.alert('Order Error', orderError.message);
          return;
        }

        let deliveryPin = String(orderData?.delivery_pin ?? '');

        if (!deliveryPin && orderData?.id) {
          const pinResult = await supabase
            .from('orders')
            .select('delivery_pin')
            .eq('id', orderData.id)
            .maybeSingle();

          if (!pinResult.error && pinResult.data?.delivery_pin) {
            deliveryPin = String(pinResult.data.delivery_pin);
          }
        }

        setPlacedOrderDeliveryPin(deliveryPin);

        const orderItemsPayload = orderItems.map(({ product, cartItem }) => {
          const customerUnitPrice = getDisplayUnitPrice(product);
          const retailerUnitPrice = getRetailerPayoutUnitPrice(product);
          const baseRetailerAmount = roundMoney(retailerUnitPrice * cartItem.quantity);
          const customerLineTotal = roundMoney(customerUnitPrice * cartItem.quantity);
          const selectedVariant = cartItem.productVariantId ? variantByIdForCheckout.get(cartItem.productVariantId) : null;

          return {
            order_id: orderData.id,
            product_id: product.id,
            product_variant_id: cartItem.productVariantId ?? null,
            retailer_id: product.retailer_id,
            product_name: product.name,
            product_name_ar_snapshot: getProductArabicTitle(product) || cartItem.arabicName || null,
            product_subcategory_snapshot: product.subcategory_name ?? null,
            size_label_snapshot: cartItem.sizeLabel ?? selectedVariant?.size_label ?? null,
            variant_sku_snapshot: cartItem.variantSku ?? selectedVariant?.variant_sku ?? null,
            variant_warehouse_location_snapshot: cartItem.variantWarehouseLocation ?? selectedVariant?.warehouse_location ?? null,
            quantity: cartItem.quantity,
            vendor_price: retailerUnitPrice,
            app_price: customerUnitPrice,
            line_total: customerLineTotal,
            // Important accounting rule:
            // retailer_amount_owed stays as the retailer's product payout BEFORE free-delivery sponsorship.
            // Retailer-sponsored Free Express Delivery is saved separately in order_retailer_promotion_deductions and is deducted on the locked CliQ receipt.
            // This lets customer service see: gross payout -> fulfillment fee -> Free Express Delivery paid by retailer -> final CliQ added.
            retailer_amount_owed: baseRetailerAmount,
            darik_fulfillment_fee_amount: roundMoney(baseRetailerAmount * DARIK_FULFILLMENT_FEE_RATE),
            darik_markup_amount: roundMoney(Math.max(0, customerLineTotal - baseRetailerAmount)),
          };
        });

        const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);

        if (itemsError) {
          Alert.alert('Order Items Error', itemsError.message);
          return;
        }

        if (promotionSummary.deductions.length > 0) {
          const promotionRows = promotionSummary.deductions.map((deduction) => ({
            order_id: orderData.id,
            retailer_id: deduction.retailer_id,
            deduction_type: deduction.deduction_type,
            deduction_amount: deduction.deduction_amount,
            source_type: deduction.source_type,
            source_id: deduction.source_id,
            description: deduction.description,
          }));
          await supabase.from('order_retailer_promotion_deductions').insert(promotionRows);
        }

        let actualDarikCreditAppliedAmount = 0;
        let actualFinalTotal = preCreditTotal;
        let actualCreditBalanceAfterOrder = availableDarikCredit;

        if (darikCreditToApply > 0) {
          const creditResult = await supabase.rpc('customer_apply_darik_credit_to_order', {
            p_customer_id: activeCustomer.id,
            p_order_id: orderData.id,
            p_requested_credit: darikCreditToApply,
          });

          if (creditResult.error) {
            Alert.alert(
              'Credit Warning',
              `Your order was created, but Darik Credit was not applied automatically: ${creditResult.error.message}`
            );
          } else {
            actualDarikCreditAppliedAmount = Number(creditResult.data?.credit_applied ?? 0);
            actualFinalTotal = Number(creditResult.data?.final_total ?? preCreditTotal);
            actualCreditBalanceAfterOrder = Number(creditResult.data?.new_balance ?? availableDarikCredit);
            setCustomerProfile({
              ...activeCustomer,
              darik_credit_balance: actualCreditBalanceAfterOrder,
            });
          }
        }

        for (const { product, cartItem } of orderItems) {
          if (cartItem.productVariantId) {
            const decrementResult = await supabase.rpc('customer_decrement_product_variant_stock', {
              p_product_id: product.id,
              p_product_variant_id: cartItem.productVariantId,
              p_quantity: cartItem.quantity,
            });

            if (decrementResult.error) {
              Alert.alert('Stock Update Warning', decrementResult.error.message);
            }
          } else {
            await supabase
              .from('products')
              .update({
                quantity_in_stock: Math.max(0, Number(product.quantity_in_stock) - cartItem.quantity),
              })
              .eq('id', product.id);
          }
        }

        await sendDarikOrderReceiptEmail({
          orderId: orderData.id,
          deliveryPin,
          customerEmail: activeCustomer.email ?? customerSession.user.email ?? null,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          paymentMethod,
          deliveryLabel: selectedDeliveryStoredLabel,
          deliveryEtaLabel: selectedDeliveryConfig.etaLabel,
          deliveryAddress,
          deliveryNote,
          subtotal: roundMoney(subtotal),
          deliveryFee: roundMoney(deliveryFee),
          darikCreditAppliedAmount: roundMoney(actualDarikCreditAppliedAmount),
          total: roundMoney(actualFinalTotal),
          items: orderItems.map(({ product, cartItem }) => {
            const selectedVariant = cartItem.productVariantId ? variantByIdForCheckout.get(cartItem.productVariantId) : null;
            const unitPrice = getDisplayUnitPrice(product);

            return {
              name: product.name,
              size: cartItem.sizeLabel ?? selectedVariant?.size_label ?? null,
              quantity: cartItem.quantity,
              unitPrice: roundMoney(unitPrice),
              lineTotal: roundMoney(unitPrice * cartItem.quantity),
            };
          }),
        });

        // Freeze the confirmation values before any refresh or cart/product state changes.
        // This prevents the confirmation modal from recalculating from live state after submit.
        setLastOrderConfirmation({
          customerName: customerName.trim(),
          paymentMethod,
          deliveryLabel: selectedDeliveryStoredLabel,
          deliveryEtaLabel: selectedDeliveryConfig.etaLabel,
          deliveryFee,
          promotionDiscountTotal,
          preCreditTotal,
          darikCreditAppliedAmount: actualDarikCreditAppliedAmount,
          total: actualFinalTotal,
          deliveryLocation,
        });

        // Close checkout and show confirmation immediately. Do NOT call loadCustomerData() here,
        // because it turns on the full-screen loading state and can make the app look like it
        // crashed/reloaded right after a successful order. We refresh order history in the
        // background and update local stock safely instead.
        setCheckoutVisible(false);
        setCartVisible(false);
        setOrderPlacedVisible(true);

        setProducts((currentProducts) =>
          currentProducts.map((currentProduct) => {
            const orderedQuantity = orderItems
              .filter(({ product }) => product.id === currentProduct.id)
              .reduce((totalQuantity, line) => totalQuantity + line.cartItem.quantity, 0);
            if (orderedQuantity <= 0) return currentProduct;

            return {
              ...currentProduct,
              quantity_in_stock: Math.max(0, Number(currentProduct.quantity_in_stock ?? 0) - orderedQuantity),
            };
          })
        );

        loadCustomerOrders(activeCustomer.id).catch(() => {});
  
    } finally {
      placeOrderInFlightRef.current = false;
      setPlacingOrder(false);
    }
  }

  function startNewOrder() {
    setCartItems([]);
    setCartProductSnapshots([]);
    setCustomerName(customerProfile?.full_name ?? '');
    setCustomerPhone(customerProfile?.phone ?? '');
    setDeliveryAddress('');
    setDeliveryNote('');
    setPaymentMethod('Cash');
    setSelectedDeliveryOption('next_day_free');
    setDeliveryLocation(null);
    setDeliveryLocationConfirmed(false);
    setPlacedOrderDeliveryPin('');
    setLastOrderConfirmation(null);
    setOrderPlacedVisible(false);
  }

  if (authLoading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingLogoCard}>
          <Image source={darikLoadingLogo} style={styles.loadingLogoImage} />
        </View>
        <Text style={styles.loadingTitle}>{t('loading')}</Text>
      </View>
    );
  }

  if (!customerSession) {
    return (
      <KeyboardAvoidingView
        style={styles.authKeyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView
          style={styles.authScreen}
          contentContainerStyle={styles.authContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.authLogoCard}>
            <Image source={darikHeaderLogo} style={styles.authLogoImage} />
          </View>

          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            {renderLanguageToggle('light')}
          </View>

          <Text style={styles.authTitle}>{t('welcomeToDarik')}</Text>
          <Text style={styles.authSubtitle}>{t('authSubtitle')}</Text>

          <View style={styles.authModeRow}>
            <TouchableOpacity
              style={[styles.authModeButton, authMode === 'login' && styles.authModeButtonActive]}
              onPress={() => setAuthMode('login')}
            >
              <Text
                style={[
                  styles.authModeButtonText,
                  authMode === 'login' && styles.authModeButtonTextActive,
                ]}
              >
                {t('login')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authModeButton, authMode === 'signup' && styles.authModeButtonActive]}
              onPress={() => setAuthMode('signup')}
            >
              <Text
                style={[
                  styles.authModeButtonText,
                  authMode === 'signup' && styles.authModeButtonTextActive,
                ]}
              >
                {t('signUp')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.authCard}>
            {authMode === 'login' ? (
              <>
                <Text style={styles.authCardTitle}>{t('customerLogin')}</Text>

                <Text style={styles.inputLabel}>{t('email')}</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={t('customerEmailPlaceholder')}
                  placeholderTextColor="#888"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={loginEmail}
                  onChangeText={setLoginEmail}
                />

                <Text style={styles.inputLabel}>{t('password')}</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={t('passwordPlaceholder')}
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                />

                <TouchableOpacity
                  style={styles.forgotPasswordButton}
                  onPress={() => {
                    setPasswordResetOpen((current) => !current);
                    setPasswordResetEmail(loginEmail);
                    setPasswordResetSent(false);
                  }}
                >
                  <Text style={styles.forgotPasswordButtonText}>Forgot password? Reset password</Text>
                </TouchableOpacity>

                {passwordResetOpen ? (
                  <View style={styles.passwordResetBox}>
                    <Text style={styles.inputLabel}>Account Email</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder={t('customerEmailPlaceholder')}
                      placeholderTextColor="#888"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      value={passwordResetEmail}
                      onChangeText={(text) => {
                        setPasswordResetEmail(text);
                        setPasswordResetSent(false);
                      }}
                    />

                    <TouchableOpacity
                      style={[styles.passwordResetButton, passwordResetBusy && styles.authSubmitButtonDisabled]}
                      disabled={passwordResetBusy}
                      onPress={() => handleCustomerPasswordResetRequest().catch(() => {})}
                    >
                      <Text style={styles.passwordResetButtonText}>
                        {passwordResetBusy ? 'Sending...' : passwordResetSent ? 'Send Reset Link Again' : 'Send Reset Link'}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.passwordResetHelpText}>
                      {passwordResetSent
                        ? 'Reset link sent. Check your inbox and spam folder.'
                        : 'Enter your Darik account email and we will send a secure reset link.'}
                    </Text>
                  </View>
                ) : null}
              </>
            ) : (
              <>
                <Text style={styles.authCardTitle}>{t('createCustomerAccount')}</Text>

                <Text style={styles.inputLabel}>{t('fullName')}</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={t('namePlaceholder')}
                  placeholderTextColor="#888"
                  value={signupName}
                  onChangeText={setSignupName}
                />

                <Text style={styles.inputLabel}>{t('phoneNumber')}</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={t('phonePlaceholder')}
                  placeholderTextColor="#888"
                  keyboardType="phone-pad"
                  value={signupPhone}
                  onChangeText={(text) => {
                    setSignupPhone(text);
                    setSignupConfirmationCodeSent(false);
                  }}
                />

                <Text style={styles.inputLabel}>Confirm Phone Number</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Re-enter phone number"
                  placeholderTextColor="#888"
                  keyboardType="phone-pad"
                  value={signupPhoneConfirm}
                  onChangeText={(text) => {
                    setSignupPhoneConfirm(text);
                    setSignupConfirmationCodeSent(false);
                  }}
                />

                <Text style={styles.inputLabel}>{t('email')}</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={t('customerEmailPlaceholder')}
                  placeholderTextColor="#888"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={signupEmail}
                  onChangeText={(text) => {
                    setSignupEmail(text);
                    setSignupConfirmationCodeSent(false);
                  }}
                />

                <TouchableOpacity
                  style={[styles.signupCodeButton, (authBusy || signupCodeCooldownSeconds > 0) && styles.authSubmitButtonDisabled]}
                  disabled={authBusy || signupCodeCooldownSeconds > 0}
                  onPress={() => sendCustomerSignupConfirmationCode().catch(() => {})}
                >
                  <Text style={styles.signupCodeButtonText}>
                    {signupCodeCooldownSeconds > 0 ? `Resend code in ${signupCodeCooldownSeconds}s` : signupConfirmationCodeSent ? 'Send Confirmation Code Again' : 'Send Confirmation Code'}
                  </Text>
                </TouchableOpacity>

                {signupConfirmationCodeSent ? (
                  <>
                    <Text style={styles.inputLabel}>Email Confirmation Code</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Enter code from email"
                      placeholderTextColor="#888"
                      keyboardType="number-pad"
                      value={signupEmailCode}
                      onChangeText={setSignupEmailCode}
                    />
                    <Text style={styles.signupCodeHelp}>
                      Check your inbox and spam folder, then enter the code here. You can resend after 60 seconds.
                    </Text>
                  </>
                ) : null}

                <Text style={styles.inputLabel}>{t('password')}</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder={t('minimumPasswordPlaceholder')}
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={signupPassword}
                  onChangeText={(text) => {
                    setSignupPassword(text);
                    setSignupConfirmationCodeSent(false);
                  }}
                />

                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Re-enter password"
                  placeholderTextColor="#888"
                  secureTextEntry
                  value={signupPasswordConfirm}
                  onChangeText={(text) => {
                    setSignupPasswordConfirm(text);
                    setSignupConfirmationCodeSent(false);
                  }}
                />
              </>
            )}

            <TouchableOpacity
              style={styles.rememberRow}
              onPress={() => setRememberMe((current) => !current)}
            >
              <View style={[styles.rememberBox, rememberMe && styles.rememberBoxActive]}>
                {rememberMe && <Text style={styles.rememberCheck}>✓</Text>}
              </View>
              <View style={styles.rememberTextWrap}>
                <Text style={styles.rememberTitle}>{t('rememberMe')}</Text>
                <Text style={styles.rememberSubtitle}>{t('rememberMeSubtitle')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.authSubmitButton, authBusy && styles.authSubmitButtonDisabled]}
              onPress={authMode === 'login' ? handleCustomerLogin : handleCustomerSignup}
              disabled={authBusy}
            >
              <Text style={styles.authSubmitButtonText}>
                {authBusy
                  ? t('pleaseWait')
                  : authMode === 'login'
                    ? t('login')
                    : signupConfirmationCodeSent
                      ? 'Verify Code & Create Account'
                      : 'Send Confirmation Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <View style={styles.loadingLogoCard}>
          <Image source={darikLoadingLogo} style={styles.loadingLogoImage} />
        </View>
        <Text style={styles.loadingTitle}>{t('loading')}</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={[styles.screen, { backgroundColor: '#F3F4F6' }]}
        contentContainerStyle={[styles.content, { paddingTop: 56, paddingBottom: 42 }]}
        scrollEventThrottle={400}
        onScroll={(event) => {
          const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

          if (selectedCategoryId === 'BestSellers') {
            if (contentOffset.y > 80) {
              bestSellerUserScrolledDownRef.current = true;
            }

            const nearBestSellerBottom =
              layoutMeasurement.height + contentOffset.y >= contentSize.height - 220;

            if (bestSellerUserScrolledDownRef.current && nearBestSellerBottom) {
              setBestSellerVisibleCategoryCount((current) => {
                if (current >= bestSellerDepartments.length) return current;
                return Math.min(
                  current + BEST_SELLER_CATEGORY_LOAD_MORE_COUNT,
                  bestSellerDepartments.length,
                );
              });
            }

            return;
          }

          const nearBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 900;
          if (nearBottom) {
            loadMoreProducts().catch(() => {});
          }
        }}
      >
        <View style={styles.mockTopShell}>
          <TouchableOpacity
            style={styles.mockMenuButton}
            onPress={() => setCustomerOtherOptionsVisible(true)}
            activeOpacity={0.88}
          >
            <Text style={styles.mockMenuIcon}>☰</Text>
          </TouchableOpacity>

          <View style={styles.mockHeaderLogoWrap}>
            <Image source={darikHeaderLogo} style={styles.mockHeaderLogo} resizeMode="contain" />
          </View>

          <TouchableOpacity
            style={styles.mockCartButton}
            onPress={openCartFromAnywhere}
            activeOpacity={0.88}
          >
            <Text style={styles.mockCartGlyph}>🛒</Text>
            <View style={styles.mockCartBadge}>
              <Text style={styles.mockCartBadgeText}>{cartCount}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.mockSearchWrapper}>
          <View style={styles.mockSearchShell}>
            <Text style={styles.mockSearchIcon}>⌕</Text>
            <TextInput
              style={styles.mockSearchInput}
              placeholder="Search products..."
              placeholderTextColor="#8A8A8A"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          {searchSuggestions.length > 0 && (
            <View style={styles.searchDropdown}>
              {searchSuggestions.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.searchSuggestionRow}
                  onPress={() => openProductDetail(product)}
                >
                  <View style={styles.searchSuggestionImage}>
                    {getProductGridPhotoUrl(product) ? (
                      <Image
                        source={{ uri: getProductGridPhotoUrl(product)! }}
                        style={styles.searchSuggestionImageReal}
                      />
                    ) : (
                      <Text style={styles.searchSuggestionImageText}>
                        {shortCode(getProductDisplayName(product))}
                      </Text>
                    )}
                  </View>

                  <View style={styles.searchSuggestionMiddle}>
                    <Text style={styles.searchSuggestionName}>{getProductDisplayName(product)}</Text>
                    <Text style={styles.searchSuggestionCategory}>{getCategoryName(product)}</Text>
                  </View>

                  <View style={styles.searchSuggestionPriceWrap}>
                    <Text style={styles.searchSuggestionPrice}>
                      {money(getDisplayUnitPrice(product))} JOD
                    </Text>
                    {getProductDiscountInfo(product)?.qualifies && (
                      <Text style={styles.searchSuggestionDiscountText}>{t('promo')}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.adBannerWrapper}>
          <ScrollView
            ref={bannerScrollRef}
            horizontal
            pagingEnabled
            snapToInterval={HERO_BANNER_WIDTH}
            snapToAlignment="start"
            decelerationRate="fast"
            disableIntervalMomentum
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const rawIndex = Math.round(
                event.nativeEvent.contentOffset.x / HERO_BANNER_WIDTH
              );
              const nextIndex = Math.max(
                0,
                Math.min(rawIndex, Math.max(visibleAdBanners.length - 1, 0))
              );

              setActiveBannerIndex(nextIndex);

              bannerScrollRef.current?.scrollTo({
                x: nextIndex * HERO_BANNER_WIDTH,
                animated: false,
              });
            }}
          >
            {visibleAdBanners.map((banner) => {
              const bannerRetailerName = banner.retailer_id
                ? retailerById.get(banner.retailer_id)?.business_name ?? banner.sponsor_name
                : banner.sponsor_name;

              return (
                <View
                  key={banner.id}
                  style={[
                    styles.adBannerOuterWrap,
                    {
                      width: HERO_BANNER_WIDTH,
                    },
                  ]}
                >

                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={[
                      styles.adBannerCard,
                      {
                        borderRadius: 32,
                        shadowColor: '#000',
                        shadowOpacity: 0.18,
                        shadowRadius: 20,
                        shadowOffset: { width: 0, height: 10 },
                        elevation: 5,
                      },
                      {
                        backgroundColor: banner.background_color || '#111111',
                      },
                    ]}
                    onPress={() => handleAdBannerPress(banner)}
                  >
                    {banner.id === 'permanent-darik-under-2-hours-banner' ? (
                      <Image
                        source={darikUnder2HoursBannerImage}
                        style={styles.adBannerBackgroundImage}
                      />
                    ) : banner.banner_image_url ? (
                      <Image
                        source={{ uri: banner.banner_image_url }}
                        style={styles.adBannerBackgroundImage}
                      />
                    ) : null}

                    <View style={styles.adBannerCleanOverlay}>
                      <View style={styles.adBannerMinimalBottomPill}>
                        <Text style={styles.adBannerMinimalBottomText}>{t('clickToShop')}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          {visibleAdBanners.length > 1 && (
            <View style={styles.adBannerDots}>
              {visibleAdBanners.map((banner, index) => (
                <View
                  key={`${banner.id}-dot`}
                  style={[
                    styles.adBannerDot,
                    index === activeBannerIndex && styles.adBannerDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {cartCount > 0 && (
          <TouchableOpacity style={styles.cartSummary} onPress={() => setCartVisible(true)}>
            <View>
              <Text style={styles.cartSummaryTitle}>{t('cartSummary')}</Text>
              <Text style={styles.cartSummaryText}>
                {cartCount} {cartCount === 1 ? t('itemAdded') : t('itemsAdded')}
              </Text>
            </View>

            <View style={styles.cartSummaryRight}>
              <Text style={styles.cartSummaryTotal}>{total.toFixed(2)} JOD</Text>
              <Text style={styles.cartSummarySmall}>{t('tapToViewCart')}</Text>
            </View>
          </TouchableOpacity>
        )}

<View style={styles.mockTrustGrid}>
          {[
            { title: t('freeNextDayTrustTitle'), subtitle: t('freeNextDayTrustSubtitle') },
            { title: t('expressTrustTitle'), subtitle: t('expressTrustSubtitle') },
            { title: t('securePaymentTrustTitle'), subtitle: t('securePaymentTrustSubtitle') },
            { title: t('darikPromiseTrustTitle'), subtitle: t('darikPromiseTrustSubtitle') },
          ].map((item) => (
            <View key={item.title} style={styles.mockTrustCard}>
              <Text style={styles.mockTrustTitle}>{item.title}</Text>
              <Text style={styles.mockTrustSubtitle}>{item.subtitle}</Text>
            </View>
          ))}
        </View>


        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{t('categories')}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          <TouchableOpacity
            style={[
              styles.categoryCard,
              styles.categoryCardShell,
              selectedCategoryId === 'BestSellers' && styles.categoryCardSelectedShell,
            ]}
            onPress={() => {
              setSelectedCategoryId('BestSellers');
              setSelectedClothingDepartment('All');
              setSelectedClothingItemType('All');
            }}
            activeOpacity={0.86}
          >
            <View
              style={[
                styles.categoryBestSellersImageCard,
                selectedCategoryId === 'BestSellers' && styles.categoryImageCardActive,
              ]}
            >
              <Text style={styles.categoryBestSellersIcon}>★</Text>
              {selectedCategoryId === 'BestSellers' && (
                <View style={styles.categorySelectedBadge}>
                  <Text style={styles.categorySelectedBadgeText}>{t('selected')}</Text>
                </View>
              )}
            </View>

            <Text
              style={[
                styles.categoryImageLabel,
                selectedCategoryId === 'BestSellers' && styles.categoryImageLabelActive,
              ]}
              numberOfLines={2}
            >
              {t('bestSellers')}
            </Text>
          </TouchableOpacity>

          {sortDarikCustomerCategories(categories).map((category) => {
            const previewImage = getCategoryPreviewImage(category.name);
            const fallbackEmoji = getCategoryFallbackEmoji(category.name);
            const isSelectedCategory = selectedCategoryId === category.id;

            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  styles.categoryCardShell,
                  isSelectedCategory && styles.categoryCardSelectedShell,
                ]}
                onPress={() => {
                  setSelectedCategoryId(category.id);
                  setSelectedClothingDepartment('All');
                  setSelectedClothingItemType('All');
                }}
                activeOpacity={0.86}
              >
                <View
                  style={[
                    styles.categoryImageCard,
                    isSelectedCategory && styles.categoryImageCardActive,
                  ]}
                >
                  {previewImage ? (
                    <>
                      <Image source={previewImage} style={styles.categoryPreviewImage} />
                      <View style={styles.categoryImageGradientOverlay} />
                    </>
                  ) : (
                    <View style={styles.categoryPreviewPlaceholder}>
                      {fallbackEmoji ? (
                        <Text style={styles.categoryPreviewEmoji}>{fallbackEmoji}</Text>
                      ) : (
                        <Text
                          style={[
                            styles.categoryPreviewPlaceholderText,
                            isSelectedCategory && styles.categoryPreviewPlaceholderTextActive,
                          ]}
                        >
                          {t('categoryWord')}
                        </Text>
                      )}
                    </View>
                  )}

                  {isSelectedCategory && (
                    <View style={styles.categorySelectedBadge}>
                      <Text style={styles.categorySelectedBadgeText}>{t('selected')}</Text>
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.categoryImageLabel,
                    isSelectedCategory && styles.categoryImageLabelActive,
                  ]}
                  numberOfLines={2}
                >
                  {getCategoryDisplayName(category)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {selectedCategoryIsClothing ? (
          <View style={styles.clothingFilterCard}>
            <View style={styles.clothingFilterHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.clothingFilterTitle}>
                  {selectedCategoryHasMultipleDepartmentChoices
                    ? selectedCategoryFilterLabel
                    : selectedCategoryHasDatabaseSubcategories
                      ? t('subcategories')
                      : t('clothingDepartment')}
                </Text>
                <Text style={styles.clothingFilterSub}>
                  {selectedCategoryHasMultipleDepartmentChoices
                    ? selectedCategoryCode === 'baby'
                      ? appLanguage === 'ar'
                        ? 'اختر بيبي ولد أو بيبي بنت أولاً، ثم اختر نوع المنتج.'
                        : 'Choose Baby Boy or Baby Girl first, then choose the exact item type.'
                      : t('subcategoryFilterHelp')
                    : selectedCategoryHasDatabaseSubcategories
                      ? t('subcategoryFilterHelp')
                      : t('clothingFilterHelp')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.clothingFilterResetButton}
                onPress={() => {
                  setSelectedClothingDepartment(
                    selectedCategoryHasDatabaseSubcategories && !selectedCategoryHasMultipleDepartmentChoices
                      ? activeCategoryDepartmentOptions[0]?.id || selectedCategoryCode
                      : 'All'
                  );
                  setSelectedClothingItemType('All');
                }}
              >
                <Text style={styles.clothingFilterResetText}>{t('all')}</Text>
              </TouchableOpacity>
            </View>

            {selectedCategoryHasMultipleDepartmentChoices ? (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.clothingFilterChip,
                      selectedClothingDepartment === 'All' && styles.clothingFilterChipActive,
                    ]}
                    onPress={() => {
                      setSelectedClothingDepartment('All');
                      setSelectedClothingItemType('All');
                    }}
                  >
                    <Text
                      style={[
                        styles.clothingFilterChipText,
                        selectedClothingDepartment === 'All' && styles.clothingFilterChipTextActive,
                      ]}
                    >
                      {t('all')}
                    </Text>
                  </TouchableOpacity>

                  {activeCategoryDepartmentOptions.map((department) => (
                    <TouchableOpacity
                      key={department.id}
                      style={[
                        styles.clothingFilterChip,
                        selectedClothingDepartment === department.id && styles.clothingFilterChipActive,
                      ]}
                      onPress={() => {
                        setSelectedClothingDepartment(department.id);
                        setSelectedClothingItemType('All');
                      }}
                    >
                      <Text
                        style={[
                          styles.clothingFilterChipText,
                          selectedClothingDepartment === department.id && styles.clothingFilterChipTextActive,
                        ]}
                      >
                        {appLanguage === 'ar' ? department.ar : department.en}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {selectedClothingDepartment === 'All' ? (
                  <Text style={styles.clothingFilterHint}>
                    {selectedCategoryCode === 'baby'
                      ? appLanguage === 'ar'
                        ? 'اختر بيبي ولد أو بيبي بنت للتصفية، أو اختر نوع المنتج مباشرة.'
                        : 'Choose Baby Boy or Baby Girl to narrow it down, or pick an item type directly.'
                      : appLanguage === 'ar'
                        ? 'اختر مجموعة للتصفية، أو اختر نوع المنتج مباشرة.'
                        : 'Choose a group to narrow it down, or pick an item type directly.'}
                  </Text>
                ) : null}
              </>
            ) : !selectedCategoryHasDatabaseSubcategories ? (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.clothingFilterChip,
                      selectedClothingDepartment === 'All' && styles.clothingFilterChipActive,
                    ]}
                    onPress={() => {
                      setSelectedClothingDepartment('All');
                      setSelectedClothingItemType('All');
                    }}
                  >
                    <Text
                      style={[
                        styles.clothingFilterChipText,
                        selectedClothingDepartment === 'All' && styles.clothingFilterChipTextActive,
                      ]}
                    >
                      {t('all')}
                    </Text>
                  </TouchableOpacity>

                  {activeCategoryDepartmentOptions.map((department) => (
                    <TouchableOpacity
                      key={department.id}
                      style={[
                        styles.clothingFilterChip,
                        selectedClothingDepartment === department.id && styles.clothingFilterChipActive,
                      ]}
                      onPress={() => {
                        setSelectedClothingDepartment(department.id);
                        setSelectedClothingItemType('All');
                      }}
                    >
                      <Text
                        style={[
                          styles.clothingFilterChipText,
                          selectedClothingDepartment === department.id && styles.clothingFilterChipTextActive,
                        ]}
                      >
                        {appLanguage === 'ar' ? department.ar : department.en}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {selectedClothingDepartment === 'All' ? (
                  <Text style={styles.clothingFilterHint}>{t('chooseClothingDepartment')}</Text>
                ) : null}
              </>
            ) : null}

            {selectedCategoryHasDatabaseSubcategories || selectedClothingDepartment !== 'All' ? (
              <>
                <Text style={styles.clothingFilterSecondTitle}>
                  {selectedCategoryHasMultipleDepartmentChoices && selectedClothingDepartment === 'All'
                    ? selectedCategoryCode === 'baby'
                      ? appLanguage === 'ar'
                        ? 'كل أنواع منتجات البيبي'
                        : 'All Baby Item Types'
                      : appLanguage === 'ar'
                        ? 'كل أنواع المنتجات'
                        : 'All Item Types'
                    : selectedSubcategoryFilterLabel}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity
                    style={[
                      styles.clothingFilterChip,
                      selectedClothingItemType === 'All' && styles.clothingFilterChipActive,
                    ]}
                    onPress={() => setSelectedClothingItemType('All')}
                  >
                    <Text
                      style={[
                        styles.clothingFilterChipText,
                        selectedClothingItemType === 'All' && styles.clothingFilterChipTextActive,
                      ]}
                    >
                      {t('all')}
                    </Text>
                  </TouchableOpacity>

                  {activeCategorySubcategoryOptions.map((itemType) => (
                    <TouchableOpacity
                      key={itemType.id}
                      style={[
                        styles.clothingFilterChip,
                        selectedClothingItemType === itemType.id && styles.clothingFilterChipActive,
                      ]}
                      onPress={() => setSelectedClothingItemType(itemType.id)}
                    >
                      <Text
                        style={[
                          styles.clothingFilterChipText,
                          selectedClothingItemType === itemType.id && styles.clothingFilterChipTextActive,
                        ]}
                      >
                        {appLanguage === 'ar' ? itemType.ar : itemType.en}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </>
            ) : null}
          </View>
        ) : null}

        <View style={styles.sectionRow}>
          <View>
            <Text style={styles.sectionTitle}>{t('darikLiveMarketplace')}</Text>
            <Text style={{ color: '#777777', fontSize: 12, fontWeight: '700', marginTop: 2 }}>
              {t('verifiedStockReady')}
            </Text>
          </View>
          <Text style={styles.viewAll}>{displayedProductCountLabel}</Text>
        </View>

        {selectedCategoryId !== 'BestSellers' ? (
          <View style={styles.productSortCard}>
            <Text style={styles.productSortLabel}>{t('sortProducts')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { id: 'best_sellers' as ProductSortOption, label: t('bestSellers') },
                { id: 'price_low_high' as ProductSortOption, label: t('priceLowHigh') },
                { id: 'price_high_low' as ProductSortOption, label: t('priceHighLow') },
              ].map((sortOption) => {
                const isActiveSort = selectedProductSort === sortOption.id;

                return (
                  <TouchableOpacity
                    key={sortOption.id}
                    style={[
                      styles.productSortChip,
                      isActiveSort && styles.productSortChipActive,
                    ]}
                    onPress={() => setSelectedProductSort(sortOption.id)}
                    activeOpacity={0.88}
                  >
                    <Text
                      style={[
                        styles.productSortChipText,
                        isActiveSort && styles.productSortChipTextActive,
                      ]}
                    >
                      {sortOption.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        {selectedRetailer && (
          <View style={styles.retailerFilterCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.retailerFilterLabel}>{t('showingProductsFrom')}</Text>
              <Text style={styles.retailerFilterName}>{selectedRetailer.business_name}</Text>
            </View>

            <TouchableOpacity style={styles.retailerFilterClearButton} onPress={clearRetailerFilter}>
              <Text style={styles.retailerFilterClearText}>{t('clear')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {productsLoadingPage ? (
          <View style={styles.noResultsCard}>
            <Text style={styles.noResultsTitle}>{t('loadingProducts')}</Text>
            <Text style={styles.noResultsText}>{t('pullingProducts')}</Text>
          </View>
        ) : filteredProducts.length === 0 ? (
          <View style={styles.noResultsCard}>
            <Text style={styles.noResultsTitle}>{t('noLiveProductsFound')}</Text>
            <Text style={styles.noResultsText}>
              {t('addApproveProductsHint')}
            </Text>
          </View>
        ) : selectedCategoryId === 'BestSellers' ? (
          <View style={styles.bestSellerDepartmentStack}>
            {visibleBestSellerDepartments.map((department) => {
              const departmentProducts = products.filter((product) => product.category_id === department.id);

              if (departmentProducts.length === 0) return null;

              const currentBestSellerPage = bestSellerPageByCategoryId[department.id] ?? 1;
              const visibleProductCount = Math.min(
                departmentProducts.length,
                currentBestSellerPage * BEST_SELLER_SECTION_PAGE_SIZE,
              );
              const visibleDepartmentProducts = departmentProducts.slice(0, visibleProductCount);
              const departmentHasMoreProducts = visibleProductCount < departmentProducts.length;

              function loadNextBestSellerPage() {
                if (!departmentHasMoreProducts) return;

                setBestSellerPageByCategoryId((currentPages) => ({
                  ...currentPages,
                  [department.id]: (currentPages[department.id] ?? 1) + 1,
                }));
              }

              return (
                <View key={department.id} style={styles.bestSellerDepartmentSection}>
                  <View style={styles.bestSellerDepartmentHeaderRow}>
                    <Text style={styles.bestSellerDepartmentTitle}>
                      {t('bestSellersIn')} {getCategoryDisplayName(department)} →
                    </Text>
                    <Text style={styles.bestSellerDepartmentCountText}>
                      {visibleProductCount}/{departmentProducts.length}
                    </Text>
                  </View>

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.bestSellerCarouselContent}
                    scrollEventThrottle={16}
                    onMomentumScrollEnd={(event) => {
                      if (!departmentHasMoreProducts) return;

                      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                      const nearRightEdge =
                        contentOffset.x + layoutMeasurement.width >= contentSize.width - 90;

                      if (nearRightEdge) {
                        loadNextBestSellerPage();
                      }
                    }}
                  >
                    {visibleDepartmentProducts.map((product) => (
                      <TouchableOpacity
                        key={product.id}
                        style={styles.bestSellerCleanItem}
                        onPress={() => openProductDetail(product)}
                        activeOpacity={0.9}
                      >
                        <View style={styles.bestSellerCleanImageWrap}>
                          {getProductGridPhotoUrl(product) ? (
                            <Image
                              source={{ uri: getProductGridPhotoUrl(product)! }}
                              style={styles.bestSellerCleanImage}
                            />
                          ) : (
                            <View style={styles.bestSellerCleanPlaceholder}>
                              <Text style={styles.bestSellerCleanPlaceholderText}>{shortCode(product.name)}</Text>
                            </View>
                          )}

                          {hasProductFreeShipping(product) ? (
                            <View style={styles.bestSellerCleanFreeBadge}>
                              <Text style={styles.bestSellerCleanFreeBadgeText}>{t('free')}</Text>
                            </View>
                          ) : null}
                        </View>

                        <Text style={styles.bestSellerCleanName} numberOfLines={1}>
                          {getProductDisplayName(product)}
                        </Text>

                        <Text style={styles.bestSellerCleanPrice} numberOfLines={1}>
                          {money(getDisplayUnitPrice(product))} JOD
                        </Text>
                      </TouchableOpacity>
                    ))}

                    {departmentHasMoreProducts ? (
                      <TouchableOpacity
                        style={styles.bestSellerLoadMoreCard}
                        onPress={loadNextBestSellerPage}
                        activeOpacity={0.9}
                      >
                        <Text style={styles.bestSellerLoadMoreIcon}>→</Text>
                        <Text style={styles.bestSellerLoadMoreText}>{t('swipeToSeeMore')}</Text>
                      </TouchableOpacity>
                    ) : null}
                  </ScrollView>
                </View>
              );
            })}

            {visibleBestSellerDepartments.length < bestSellerDepartments.length ? (
              <TouchableOpacity
                style={styles.bestSellerLoadMoreCategoriesCard}
                activeOpacity={0.9}
                onPress={() =>
                  setBestSellerVisibleCategoryCount((current) =>
                    Math.min(current + BEST_SELLER_CATEGORY_LOAD_MORE_COUNT, bestSellerDepartments.length)
                  )
                }
              >
                <Text style={styles.bestSellerLoadMoreCategoriesIcon}>↓</Text>
                <Text style={styles.bestSellerLoadMoreCategoriesTitle}>{t('swipeDownToSeeMore')}</Text>
                <Text style={styles.bestSellerLoadMoreCategoriesSub}>
                  {t('showingCategories')} {visibleBestSellerDepartments.length}/{bestSellerDepartments.length} {t('categories')}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <View style={styles.productGrid}>
            {filteredProducts.map((product) => {
              const retailerName = retailerById.get(product.retailer_id)?.business_name ?? getProductCategoryDisplayLabel(product);

              return (
                <TouchableOpacity
                  key={product.id}
                  style={styles.productCard}
                  onPress={() => openProductDetail(product)}
                  activeOpacity={0.88}
                >
                  <View style={styles.productHorizontalImageWrap}>
                    {getProductGridPhotoUrl(product) ? (
                      <Image
                        source={{ uri: getProductGridPhotoUrl(product)! }}
                        style={styles.productImageReal}
                      />
                    ) : (
                      <View style={styles.productVisualCompact}>
                        <View style={styles.productVisualCircle}>
                          <Text style={styles.productVisualCode}>{shortCode(product.name)}</Text>
                        </View>
                      </View>
                    )}

                    {hasProductFreeShipping(product) ? (
                      <View style={styles.freeShippingSticker}>
                        <Text style={styles.freeShippingStickerText}>{t('free')}</Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.productHorizontalInfo}>
                    <View style={styles.productTopLine}>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={styles.productName} numberOfLines={2}>
                          {getProductDisplayName(product)}
                        </Text>
                        <Text style={styles.productCategory} numberOfLines={1}>
                          {retailerName} ✓
                        </Text>
                      </View>

                      <Text style={styles.productHeart}>♡</Text>
                    </View>

                    <View style={styles.productBottom}>
                      <View style={styles.productPriceAndDelivery}>
                        {renderProductPriceBlock(product)}
                        <Text style={styles.productDeliveryLine} numberOfLines={1}>
                          🚚 Free Next-Day
                        </Text>
                      </View>

                      <View style={styles.productActionSlot}>
                        {renderProductCardCartAction(product)}
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {filteredProducts.length > 0 && selectedCategoryId !== 'BestSellers' && (
          <View style={{ marginTop: 14, alignItems: 'center' }}>
            {productsHasMore ? (
              <TouchableOpacity
                style={{
                  backgroundColor: '#111111',
                  borderRadius: 18,
                  paddingVertical: 12,
                  paddingHorizontal: 18,
                  opacity: productsLoadingMore ? 0.65 : 1,
                }}
                onPress={() => loadMoreProducts()}
                disabled={productsLoadingMore}
              >
                <Text style={{ color: '#FFD23F', fontWeight: '900', fontSize: 13 }}>
                  {productsLoadingMore ? 'Loading more...' : 'Load More Products'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ color: '#777777', fontWeight: '800', fontSize: 12 }}>
                End of current results
              </Text>
            )}
          </View>
        )}

        <View
          style={{
            backgroundColor: '#111111',
            borderRadius: 28,
            padding: 18,
            marginTop: 18,
            marginBottom: 10,
          }}
        >
          <Text style={{ color: '#FFD23F', fontSize: 13, fontWeight: '900', letterSpacing: 0.6 }}>
            DARIK OPERATIONS PROMISE
          </Text>
          <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: 6 }}>
            Essentials delivered with warehouse-level control.
          </Text>
          <Text style={{ color: '#D6D6D6', fontSize: 13, fontWeight: '700', marginTop: 8, lineHeight: 19 }}>
            Every live item is tied to stock, routing, driver dispatch, and order history.
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={storefrontVisible && !!selectedStoreRetailer}
        animationType="slide"
        onRequestClose={closeStorefront}
      >
        {selectedStoreRetailer && (
          <ScrollView style={styles.storeScreen} contentContainerStyle={styles.storeContent}>
            <View style={styles.storeHero}>
              {selectedStoreBanner?.banner_image_url ? (
                <Image source={{ uri: selectedStoreBanner.banner_image_url }} style={styles.storeHeroImage} />
              ) : null}

              <View style={styles.storeHeroOverlay}>
                <TouchableOpacity style={styles.storeBackButton} onPress={closeStorefront}>
                  <Text style={styles.storeBackButtonText}>{t('back')}</Text>
                </TouchableOpacity>

                <View style={styles.storeHeroTopRow}>
                  <View style={styles.storeSponsoredPill}>
                    <Text style={styles.storeSponsoredPillText}>{t('sponsoredStore')}</Text>
                  </View>
                  <Text style={styles.storeProductCount}>{productsHasMore ? `${storeProducts.length}+ products` : `${storeProducts.length} products`}</Text>
                </View>

                <Text style={styles.storeName}>{selectedStoreRetailer.business_name}</Text>
                <Text style={styles.storeSubtitle}>
                  {selectedStoreBanner?.subheadline ||
                    `Browse all live products sold by ${selectedStoreRetailer.business_name}.`}
                </Text>

                {selectedStoreBanner && (
                  <View style={styles.storeOfferCard}>
                    <Text style={styles.storeOfferTitle}>{selectedStoreBanner.headline}</Text>
                    <Text style={styles.storeOfferText}>
                      {selectedStoreBanner.offer_type === 'free_delivery' ||
                      selectedStoreBanner.offer_type === 'both'
                        ? 'Free Express Delivery is ON for this store'
                        : selectedStoreBanner.offer_type === 'discount'
                          ? `${money(selectedStoreBanner.discount_percent)}% off orders over ${money(selectedStoreBanner.discount_min_order)} JOD`
                          : 'Tap products below to shop this store.'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.storeInfoStrip}>
              <View style={styles.storeInfoBox}>
                <Text style={styles.storeInfoNumber}>{storeProducts.length}</Text>
                <Text style={styles.storeInfoLabel}>{t('liveItems')}</Text>
              </View>
              <View style={styles.storeInfoBox}>
                <Text style={styles.storeInfoNumber}>1h</Text>
                <Text style={styles.storeInfoLabel}>{t('fastDelivery')}</Text>
              </View>
              <View style={styles.storeInfoBox}>
                <Text style={styles.storeInfoNumber}>Darik</Text>
                <Text style={styles.storeInfoLabel}>{t('verifiedStore')}</Text>
              </View>
            </View>

            <View style={styles.storeSectionRow}>
              <Text style={styles.storeSectionTitle}>Shop {selectedStoreRetailer.business_name}</Text>
              <Text style={styles.storeSectionCount}>{productsHasMore ? `${storeProducts.length}+ items` : `${storeProducts.length} items`}</Text>
            </View>

            {storeProducts.length === 0 ? (
              <View style={styles.noResultsCard}>
                <Text style={styles.noResultsTitle}>{t('noProductsLiveRightNow')}</Text>
                <Text style={styles.noResultsText}>{t('checkBackSoon')}</Text>
              </View>
            ) : (
              <View style={styles.productGrid}>
                {storeProducts.map((product) => (
                  <TouchableOpacity
                    key={product.id}
                    style={[
                   styles.productCard,
                   {
                     backgroundColor: '#FFFFFF',
                     borderRadius: 28,
                     padding: 12,
                     borderWidth: 1,
                     borderColor: '#E9E9E9',
                     shadowColor: '#000',
                     shadowOpacity: 0.08,
                     shadowRadius: 16,
                     shadowOffset: { width: 0, height: 8 },
                     elevation: 3,
                   },
                 ]}
                    onPress={() => openStoreProductDetail(product)}
                  >
                    {hasProductFreeShipping(product) ? (
                      <View style={styles.freeShippingSticker}>
                        <Text style={styles.freeShippingStickerText}>{t('freeExpress')}</Text>
                      </View>
                    ) : null}

                    <View style={styles.productImagePlaceholder}>
                      {getProductGridPhotoUrl(product) ? (
                        <Image
                          source={{ uri: getProductGridPhotoUrl(product)! }}
                          style={styles.productImageReal}
                        />
                      ) : (
                        <>
                          <View style={styles.productVisualCircle}>
                            <Text style={styles.productVisualCode}>{shortCode(product.name)}</Text>
                          </View>
                          <Text style={styles.productImageText}>{getCategoryName(product)}</Text>
                        </>
                      )}
                    </View>

                    <Text style={styles.productName}>{getProductDisplayName(product)}</Text>
                    <Text style={styles.productCategory}>Sold by {getProductRetailerName(product)}</Text>

                    <View style={[styles.productBottom, productNeedsSizeSelection(product) && styles.productBottomStacked]}>
                      {renderProductPriceBlock(product)}

    {renderProductCardCartAction(product)}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {storeProducts.length > 0 && productsHasMore && (
              <TouchableOpacity
                style={{
                  marginTop: 14,
                  marginBottom: 16,
                  alignSelf: 'center',
                  backgroundColor: '#111111',
                  borderRadius: 18,
                  paddingVertical: 12,
                  paddingHorizontal: 18,
                  opacity: productsLoadingMore ? 0.65 : 1,
                }}
                onPress={() => loadMoreProducts()}
                disabled={productsLoadingMore}
              >
                <Text style={{ color: '#FFD23F', fontWeight: '900', fontSize: 13 }}>
                  {productsLoadingMore ? 'Loading more...' : 'Load More Store Products'}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        )}
      </Modal>

      <Modal
        visible={productDetailVisible}
        animationType="slide"
        onRequestClose={() => setProductDetailVisible(false)}
      >
        {selectedProduct && (
          <ScrollView style={styles.detailScreen} contentContainerStyle={styles.detailContent}>
            <View style={styles.detailHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setProductDetailVisible(false)}
              >
                <Text style={styles.backButtonText}>{t('back')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cartCircle} onPress={openCartFromAnywhere}>
                <Text style={styles.cartText}>{cartCount}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailImageBox}>
              {getProductDetailImages(selectedProduct).length > 0 ? (
                <>
                  <Image
                    source={{ uri: getProductDetailImages(selectedProduct)[selectedProductPhotoIndex] }}
                    style={styles.detailProductImageReal}
                  />

                  {getProductDetailImages(selectedProduct).length > 1 && (
                    <>
                      <View style={styles.detailPhotoCounterPill}>
                        <Text style={styles.detailPhotoCounterText}>
                          {selectedProductPhotoIndex + 1}/{getProductDetailImages(selectedProduct).length}
                        </Text>
                      </View>

                      <View style={styles.detailPhotoArrowRow}>
                        <TouchableOpacity
                          style={[
                            styles.detailPhotoArrowButton,
                            selectedProductPhotoIndex === 0 && styles.detailPhotoArrowButtonDisabled,
                          ]}
                          disabled={selectedProductPhotoIndex === 0}
                          onPress={() =>
                            setSelectedProductPhotoIndex((current) => Math.max(0, current - 1))
                          }
                        >
                          <Text style={styles.detailPhotoArrowText}>‹</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.detailPhotoArrowButton,
                            selectedProductPhotoIndex >= getProductDetailImages(selectedProduct).length - 1 &&
                              styles.detailPhotoArrowButtonDisabled,
                          ]}
                          disabled={selectedProductPhotoIndex >= getProductDetailImages(selectedProduct).length - 1}
                          onPress={() =>
                            setSelectedProductPhotoIndex((current) =>
                              Math.min(getProductDetailImages(selectedProduct).length - 1, current + 1)
                            )
                          }
                        >
                          <Text style={styles.detailPhotoArrowText}>›</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </>
              ) : (
                <View style={styles.detailProductMockup}>
                  <View style={styles.detailProductMockupTop}>
                    <Text style={styles.detailProductMockupCode}>
                      {shortCode(getProductDisplayName(selectedProduct))}
                    </Text>
                  </View>
                  <Text style={styles.detailProductMockupName}>{getProductDisplayName(selectedProduct)}</Text>
                  <Text style={styles.detailProductMockupCategory}>
                    {getCategoryName(selectedProduct)}
                  </Text>
                </View>
              )}
            </View>

            {getProductDetailImages(selectedProduct).length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.detailThumbnailScroll}
              >
                {getProductDetailImages(selectedProduct).map((photoUrl, index) => (
                  <TouchableOpacity
                    key={`${photoUrl}-${index}`}
                    style={[
                      styles.detailThumbnailButton,
                      selectedProductPhotoIndex === index && styles.detailThumbnailButtonActive,
                    ]}
                    onPress={() => setSelectedProductPhotoIndex(index)}
                  >
                    <Image source={{ uri: photoUrl }} style={styles.detailThumbnailImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <View style={styles.detailBadgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{t('live')}</Text>
              </View>

              <Text style={styles.detailRating}>{t('ratingReviews')}</Text>
            </View>

            <Text style={styles.detailProductName}>{getProductDisplayName(selectedProduct)}</Text>
            <Text style={styles.detailCategory}>{getCategoryName(selectedProduct)}</Text>
            <Text style={styles.detailSoldBy}>Sold by {getProductRetailerName(selectedProduct)}</Text>
            {selectedProduct.product_free_delivery_enabled && (
              <View style={styles.detailFreeShippingBadge}>
                <Text style={styles.detailFreeShippingBadgeText}>
                  🛵 FREE EXPRESS DELIVERY
                </Text>
              </View>
            )}
            {renderProductPriceBlock(selectedProduct, 'detail')}
            {renderSizeSelector(selectedProduct)}

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>{t('description')}</Text>
              <Text style={styles.detailDescription}>
                {selectedProduct.description || 'No description added yet.'}
              </Text>
            </View>

            <View style={styles.detailCard}>
              <Text style={styles.detailSectionTitle}>{t('reviews')}</Text>
              <View style={styles.reviewBox}>
                <Text style={styles.reviewName}>{t('verifiedBuyer')}</Text>
                <Text style={styles.reviewText}>{t('goodQualityDelivered')}</Text>
              </View>
            </View>

            {renderProductDetailCartControls(selectedProduct)}
          </ScrollView>
        )}
      </Modal>

      <Modal
        visible={exchangeCheckoutVisible}
        animationType="slide"
        onRequestClose={closeExchangeReplacementCheckoutAndReturnToOrder}
      >
        <ScrollView style={styles.checkoutScreen} contentContainerStyle={styles.checkoutContent}>
          {!exchangeSizeOrder || !exchangeSizeItem ? (
            <View style={styles.checkoutCard}>
              <Text style={styles.checkoutSectionTitle}>{t('replacementCheckoutTitle')}</Text>
              <Text style={styles.checkoutHelpText}>{t('pleaseWait')}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeExchangeReplacementCheckoutAndReturnToOrder}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <View style={styles.checkoutHeader}>
            <View>
              <Text style={styles.checkoutTitle}>{t('replacementCheckoutTitle')}</Text>
              <Text style={styles.checkoutSubtitle}>{t('replacementCheckoutSubtitle')}</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={closeExchangeReplacementCheckoutAndReturnToOrder}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.checkoutCard}>
            <Text style={styles.checkoutSectionTitle}>{t('confirmReplacementRequest')}</Text>

            <View style={{ marginTop: 12, borderRadius: 16, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', padding: 12 }}>
              <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '900', textTransform: 'uppercase' }}>
                {t('selectedReplacementItem')}
              </Text>
              <Text style={{ color: '#111111', fontSize: 16, fontWeight: '900', marginTop: 5 }}>
                {exchangeSizeItem ? getOrderItemDisplayName(exchangeSizeItem) : t('replacementExchangeDelivery')}
              </Text>
              <Text style={{ color: '#6B7280', fontSize: 12, fontWeight: '800', marginTop: 4 }}>
                {t('selectedReplacementSize')}: {selectedExchangeVariant?.size_label || exchangeSizeItem?.size_label_snapshot || t('noReplacementSizeSelected')}
              </Text>
            </View>
          </View>

          <View style={styles.checkoutCard}>
            <Text style={styles.checkoutSectionTitle}>{t('pickupLocation')}</Text>
            <Text style={styles.checkoutHelpText}>{t('useOriginalOrNewPickup')}</Text>

            <TouchableOpacity
              style={[styles.locationButton, gettingLocation && styles.locationButtonDisabled]}
              onPress={useCurrentLocation}
              disabled={gettingLocation}
            >
              <Text style={styles.locationButtonText}>
                {gettingLocation ? t('pleaseWait') : t('useCurrentLocation')}
              </Text>
            </TouchableOpacity>

            <View style={styles.manualGpsBox}>
              <Text style={styles.manualGpsTitle}>{t('manualGpsTitle')}</Text>
              <Text style={styles.manualGpsSubtitle}>{t('manualGpsSubtitle')}</Text>

              <View style={styles.gpsInputRow}>
                <View style={styles.gpsInputBox}>
                  <Text style={styles.inputLabel}>{t('latitude')}</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="31.953900"
                    placeholderTextColor="#888"
                    value={manualLatitude}
                    onChangeText={setManualLatitude}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.gpsInputBox}>
                  <Text style={styles.inputLabel}>{t('longitude')}</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="35.910600"
                    placeholderTextColor="#888"
                    value={manualLongitude}
                    onChangeText={setManualLongitude}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.manualGpsButton} onPress={applyManualDeliveryLocation}>
                <Text style={styles.manualGpsButtonText}>{t('useManualGps')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.savedLocationsBox}>
              <View style={styles.savedLocationsHeader}>
                <Text style={styles.savedLocationsTitle}>{t('selectPickupFromSavedLocations')}</Text>
                <TouchableOpacity
                  style={styles.savedLocationsRefreshButton}
                  onPress={() => loadCustomerSavedLocations(customerProfile?.id)}
                >
                  <Text style={styles.savedLocationsRefreshText}>{t('refresh')}</Text>
                </TouchableOpacity>
              </View>

              {savedLocations.length === 0 ? (
                <View style={styles.savedLocationsEmptyBox}>
                  <Text style={styles.savedLocationsEmptyTitle}>{t('noSavedLocationsYet')}</Text>
                  <Text style={styles.savedLocationsEmptyText}>{t('useOriginalOrNewPickup')}</Text>
                </View>
              ) : (
                <View style={styles.savedLocationsList}>
                  {savedLocations.map((location) => (
                    <TouchableOpacity
                      key={`exchange-pickup-${location.id}`}
                      style={styles.savedLocationButton}
                      onPress={() => useSavedDeliveryLocation(location)}
                    >
                      <View style={styles.savedLocationIconCircle}>
                        <Text style={styles.savedLocationIconText}>⌂</Text>
                      </View>

                      <View style={styles.savedLocationTextWrap}>
                        <Text style={styles.savedLocationName}>{location.label}</Text>
                        <Text style={styles.savedLocationCoords}>
                          {Number(location.latitude).toFixed(5)}, {Number(location.longitude).toFixed(5)}
                        </Text>
                      </View>

                      <Text style={styles.savedLocationUseText}>{t('use')}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <Text style={styles.inputLabel}>{t('currentPickupLocation')}</Text>
            <View style={styles.selectedLocationBox}>
              <Text style={styles.selectedLocationText}>
                {deliveryLocation
                  ? `${deliveryAddress || `${deliveryLocation.latitude.toFixed(6)}, ${deliveryLocation.longitude.toFixed(6)}`}`
                  : t('noLocationSelected')}
              </Text>
            </View>

            {deliveryLocation ? (
              <>
                <View style={styles.embeddedMapCard}>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.embeddedMap}
                    region={getDeliveryMapRegion(deliveryLocation)}
                    onPress={(event) => {
                      const { latitude, longitude } = event.nativeEvent.coordinate;
                      void updateDeliveryLocationFromMap(latitude, longitude);
                    }}
                  >
                    <Marker
                      coordinate={deliveryLocation}
                      draggable
                      title="Darik pickup location"
                      description="Drag to adjust the pickup pin"
                      onDragEnd={(event) => {
                        const { latitude, longitude } = event.nativeEvent.coordinate;
                        void updateDeliveryLocationFromMap(latitude, longitude);
                      }}
                    />
                  </MapView>
                </View>
                <Text style={[styles.selectedLocationText, { marginBottom: 8, color: '#6B7280' }]}>
                  {t('embeddedMapHelp')} {t('tapMapToAdjustPin')}
                </Text>
                <TouchableOpacity style={styles.googleMapsButton} onPress={openGoogleMaps}>
                  <Text style={styles.googleMapsButtonText}>{t('openInGoogleMaps')}</Text>
                </TouchableOpacity>
              </>
            ) : null}

            <Text style={styles.inputLabel}>{t('extraAddressDetails')}</Text>
            <TextInput
              style={[styles.formInput, styles.addressInput]}
              placeholder={t('extraAddressPlaceholder')}
              placeholderTextColor="#888"
              multiline
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
            />

            <Text style={styles.inputLabel}>{t('replacementPickupNoteLabel')}</Text>
            <TextInput
              style={styles.formInput}
              placeholder={t('deliveryNotePlaceholder')}
              placeholderTextColor="#888"
              value={deliveryNote}
              onChangeText={setDeliveryNote}
            />
          </View>

          <TouchableOpacity
            style={[styles.placeOrderButton, (!exchangeSizeOrder || !exchangeSizeItem || !deliveryLocation || returnRequestBusyItemId === exchangeSizeItem?.id) && styles.placeOrderButtonDisabled]}
            onPress={submitExchangeReplacementFromCheckout}
            disabled={!exchangeSizeOrder || !exchangeSizeItem || !deliveryLocation || returnRequestBusyItemId === exchangeSizeItem?.id}
          >
            <Text style={styles.placeOrderButtonText}>
              {returnRequestBusyItemId === exchangeSizeItem?.id ? t('submitting') : t('submitReplacementRequest')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>

      <Modal
        visible={exchangeSizeModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeExchangeSizePickerAndReturnToOrder}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.cartSheet, { maxHeight: '72%' }]}> 
            <View style={styles.cartHandle} />
            <View style={styles.cartHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cartTitle}>{t('chooseReplacementSize')}</Text>
                <Text style={styles.cartSubtitle}>
                  {exchangeSizeItem ? getOrderItemDisplayName(exchangeSizeItem) : 'Replacement item'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeExchangeSizePickerAndReturnToOrder}
              >
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: '#6B7280', fontSize: 12, fontWeight: '800', lineHeight: 18, marginBottom: 12 }}>
              {t('replacementSizeHelp')}
            </Text>

            {exchangeSizeLoading ? (
              <View style={styles.emptyCart}>
                <Text style={styles.emptyCartTitle}>{t('loadingSizes')}</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                {exchangeSizeVariants.map((variant) => {
                  const stock = Number(variant.quantity_in_stock ?? 0);
                  const isOut = stock <= 0;
                  const wasOriginalSize = exchangeSizeItem?.product_variant_id === variant.id || exchangeSizeItem?.size_label_snapshot === variant.size_label;

                  return (
                    <TouchableOpacity
                      key={variant.id}
                      disabled={isOut || returnRequestBusyItemId === exchangeSizeItem?.id}
                      style={{
                        marginBottom: 10,
                        borderRadius: 18,
                        padding: 14,
                        borderWidth: 1,
                        borderColor: isOut ? '#E5E7EB' : '#111111',
                        backgroundColor: isOut ? '#F3F4F6' : '#FFFFFF',
                        opacity: isOut ? 0.55 : 1,
                      }}
                      onPress={() => chooseExchangeReplacementSize(variant)}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: '#111111', fontSize: 16, fontWeight: '900' }}>{t('sizeWord')} {variant.size_label}</Text>
                          <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '800', marginTop: 3 }}>
                            {wasOriginalSize ? `${t('originalOrderedSize')} | ` : ''}{variant.variant_sku ? `${t('labelWord')}: ${variant.variant_sku} | ` : ''}{stock} {t('availableWord')}
                          </Text>
                        </View>
                        <Text style={{ color: isOut ? '#991B1B' : '#078C3B', fontSize: 12, fontWeight: '900' }}>
                          {isOut ? t('outWord') : t('selectWord')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={cartVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setCartVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.cartSheet}>
            <View style={styles.cartHandle} />

            <View style={styles.cartHeader}>
              <View>
                <Text style={styles.cartTitle}>{t('yourCart')}</Text>
                <Text style={styles.cartSubtitle}>
                  {cartCount} item{cartCount === 1 ? '' : 's'} ready for delivery
                </Text>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={() => setCartVisible(false)}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>

            {cartItems.length === 0 ? (
              <>
                <View style={styles.emptyCart}>
                  <Text style={styles.emptyCartTitle}>{t('yourCartIsEmpty')}</Text>
                  <Text style={styles.emptyCartText}>{t('addProductsToStart')}</Text>
                </View>

                {renderSavedForLaterSection()}
              </>
            ) : (
              <>
                <ScrollView
                  style={styles.cartFullScrollArea}
                  contentContainerStyle={styles.cartFullScrollContent}
                  showsVerticalScrollIndicator
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  bounces
                  overScrollMode="always"
                >
                  <View style={styles.cartItemsListBox}>
                    <View style={styles.cartItemsListHeader}>
                      <View>
                        <Text style={styles.cartItemsListTitle}>{t('itemsInYourCart')}</Text>
                        <Text style={styles.cartItemsListSubtitle}>{t('reviewQuantities')}</Text>
                      </View>
                      <Text style={styles.cartItemsListCount}>{cartCount} item{cartCount === 1 ? '' : 's'}</Text>
                    </View>
                  {cartItems.map((item) => {
                    const cartProduct = productsForPricing.find((product) => product.id === getCartProductId(item));
                    const cartPhotoUrl =
                      item.photoUrl ||
                      getProductGridPhotoUrl(cartProduct) ||
                      null;

                    return (
                      <View key={item.id} style={styles.cartItem}>
                        <View style={styles.cartItemImage}>
                          {cartPhotoUrl ? (
                            <Image
                              source={{ uri: cartPhotoUrl }}
                              style={styles.cartItemImageReal}
                            />
                          ) : (
                            <Text style={styles.cartItemImageText}>{shortCode(getBaseDisplayCartItemName(item))}</Text>
                          )}
                        </View>

                        <View style={styles.cartItemMiddle}>
                          <Text style={styles.cartItemName}>{getDisplayCartItemName(item)}</Text>
                          <Text style={styles.cartItemCategory}>{item.category}</Text>
                          {cartProduct ? (
                            renderProductPriceBlock(cartProduct, 'cart')
                          ) : (
                            <Text style={styles.cartItemPrice}>
                              {item.priceNumber.toFixed(2)} JOD each
                            </Text>
                          )}

                          <View style={styles.cartItemActionRow}>
                            <TouchableOpacity onPress={() => saveItemForLater(item)}>
                              <Text style={styles.saveForLaterText}>{t('saveForLater')}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => removeItem(item.id)}>
                              <Text style={styles.removeText}>{t('remove')}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.quantityBox}>
                        <TouchableOpacity
                          style={styles.quantityButton}
                          onPress={() => decreaseQuantity(item.id)}
                        >
                          <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{item.quantity}</Text>

                          <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => increaseQuantity(item.id)}
                          >
                            <Text style={styles.quantityButtonText}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                  </View>

                  {renderSavedForLaterSection()}

                  <View style={styles.checkoutBox}>
                  <Text style={styles.cartDeliveryChoiceTitle}>{t('chooseDelivery')}</Text>
                  <Text style={styles.cartDeliveryChoiceSubtitle}>{t('chooseDeliverySubtitle')}</Text>
                  {renderDeliveryOptionCards()}

                  <View style={styles.cartSummaryDivider} />

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>{t('subtotal')}</Text>
                    <Text style={styles.totalValue}>{subtotal.toFixed(2)} JOD</Text>
                  </View>

                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>{selectedDeliveryDisplayLabel}</Text>
                    <Text style={styles.totalValue}>{customerDeliveryFee.toFixed(2)} JOD</Text>
                  </View>
                  <Text style={styles.deliveryStrategyText}>{selectedDeliveryConfig.etaLabel}</Text>

                  {customerOrderSavingsTotal > 0 && (
                    <View style={styles.savingsNoticeBox}>
                      <Text style={styles.savingsNoticeText}>
                        You saved {customerOrderSavingsTotal.toFixed(2)} JOD on this order
                      </Text>
                      <Text style={styles.savingsNoticeSubText}>
                        Includes item discounts, free tomorrow delivery savings, and any retailer-sponsored Free Express Delivery savings.
                      </Text>
                    </View>
                  )}

                  {darikCreditToApply > 0 && (
                    <View style={styles.totalRow}>
                      <Text style={[styles.totalLabel, { color: '#078C3B', fontWeight: '900' }]}>{t('darikCreditFromReturns')}</Text>
                      <Text style={[styles.totalValue, { color: '#078C3B', fontWeight: '900' }]}>- {darikCreditToApply.toFixed(2)} JOD</Text>
                    </View>
                  )}

                  <View style={styles.divider} />

                  <View style={styles.totalRow}>
                    <Text style={styles.grandTotalLabel}>{t('grandTotal')}</Text>
                    <Text style={styles.grandTotalValue}>{total.toFixed(2)} JOD</Text>
                  </View>

                  <TouchableOpacity style={styles.checkoutButton} onPress={openCheckout}>
                    <Text style={styles.checkoutButtonText}>{t('continueToCheckout')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.clearCartButton} onPress={clearCart}>
                    <Text style={styles.clearCartText}>{t('clearCart')}</Text>
                  </TouchableOpacity>
                </View>

                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={checkoutVisible}
        animationType="slide"
        onRequestClose={() => setCheckoutVisible(false)}
      >
        <ScrollView style={styles.checkoutScreen} contentContainerStyle={styles.checkoutContent}>
          <View style={styles.checkoutHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => setCheckoutVisible(false)}>
              <Text style={styles.backButtonText}>{t('back')}</Text>
            </TouchableOpacity>

            <Text style={styles.checkoutTitle}>{t('checkout')}</Text>
            <Text style={styles.checkoutSubtitle}>{t('checkoutSubtitle')}</Text>
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>{t('customerDetails')}</Text>

            <Text style={styles.inputLabel}>{t('fullName')}</Text>
            <TextInput
              style={styles.formInput}
              placeholder={t('namePlaceholder')}
              placeholderTextColor="#888"
              value={customerName}
              onChangeText={setCustomerName}
            />

            <Text style={styles.inputLabel}>{t('phoneNumber')}</Text>
            <TextInput
              style={styles.formInput}
              placeholder={t('phonePlaceholder')}
              placeholderTextColor="#888"
              keyboardType="phone-pad"
              value={customerPhone}
              onChangeText={setCustomerPhone}
            />
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>{t('deliveryLocation')}</Text>
            <Text style={styles.locationHelpText}>
              Use GPS for Jordan deliveries. Google Maps will open for confirmation.
            </Text>

            <TouchableOpacity style={styles.locationMainButton} onPress={useCurrentLocation}>
              <Text style={styles.locationMainButtonText}>
                {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
              </Text>
            </TouchableOpacity>

            <View style={styles.manualGpsTestBox}>
              <View style={styles.manualGpsHeaderRow}>
                <View style={styles.manualGpsHeaderTextWrap}>
                  <Text style={styles.manualGpsTitle}>{t('manualGpsTitle')}</Text>
                  <Text style={styles.manualGpsSubtitle}>{t('manualGpsSubtitle')}</Text>
                </View>
                <View style={styles.manualGpsBadge}>
                  <Text style={styles.manualGpsBadgeText}>{t('test')}</Text>
                </View>
              </View>

              <View style={styles.manualGpsInputRow}>
                <View style={styles.manualGpsInputWrap}>
                  <Text style={styles.manualGpsInputLabel}>{t('latitude')}</Text>
                  <TextInput
                    style={styles.manualGpsInput}
                    placeholder="31.945000"
                    placeholderTextColor="#999"
                    keyboardType="numbers-and-punctuation"
                    value={manualLatitude}
                    onChangeText={setManualLatitude}
                  />
                </View>

                <View style={styles.manualGpsInputWrap}>
                  <Text style={styles.manualGpsInputLabel}>{t('longitude')}</Text>
                  <TextInput
                    style={styles.manualGpsInput}
                    placeholder="35.880000"
                    placeholderTextColor="#999"
                    keyboardType="numbers-and-punctuation"
                    value={manualLongitude}
                    onChangeText={setManualLongitude}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.manualGpsApplyButton} onPress={applyManualDeliveryLocation}>
                <Text style={styles.manualGpsApplyButtonText}>{t('useManualGps')}</Text>
              </TouchableOpacity>
            </View>

            {deliveryLocation ? (
              <View style={styles.gpsCard}>
                <Text style={styles.gpsTitle}>{t('selectedDeliveryLocation')}</Text>
                <Text style={styles.gpsText}>Latitude: {deliveryLocation.latitude.toFixed(6)}</Text>
                <Text style={styles.gpsText}>Longitude: {deliveryLocation.longitude.toFixed(6)}</Text>

                <View style={styles.embeddedMapCard}>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.embeddedMap}
                    region={getDeliveryMapRegion(deliveryLocation)}
                    onPress={(event) => {
                      const { latitude, longitude } = event.nativeEvent.coordinate;
                      void updateDeliveryLocationFromMap(latitude, longitude);
                    }}
                  >
                    <Marker
                      coordinate={deliveryLocation}
                      draggable
                      title="Darik delivery location"
                      description="Drag to adjust the delivery pin"
                      onDragEnd={(event) => {
                        const { latitude, longitude } = event.nativeEvent.coordinate;
                        void updateDeliveryLocationFromMap(latitude, longitude);
                      }}
                    />
                  </MapView>
                </View>
                <Text style={[styles.gpsText, { marginTop: 8 }]}>{t('embeddedMapHelp')}</Text>
                <Text style={styles.gpsText}>{t('tapMapToAdjustPin')}</Text>
                {deliveryDistanceKm !== null && (
                  <View
                    style={{
                      marginTop: 10,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: deliveryDistanceKm <= NEXT_DAY_DELIVERY_RADIUS_KM ? '#B7E4C7' : '#FCA5A5',
                      backgroundColor: deliveryDistanceKm <= NEXT_DAY_DELIVERY_RADIUS_KM ? '#F0FDF4' : '#FEF2F2',
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: deliveryDistanceKm <= NEXT_DAY_DELIVERY_RADIUS_KM ? '#166534' : '#991B1B',
                        fontSize: 12,
                        fontWeight: '900',
                        lineHeight: 17,
                      }}
                    >
                      {deliveryCoverageStatusText}
                    </Text>
                  </View>
                )}

                <TouchableOpacity style={styles.googleMapsButton} onPress={openGoogleMaps}>
                  <Text style={styles.googleMapsButtonText}>{t('openInGoogleMaps')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveLocationButton}
                  onPress={saveCurrentDeliveryLocation}
                >
                  <Text style={styles.saveLocationButtonText}>
                    Save this location for future purchases
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noMapBox}>
                <Text style={styles.noMapTitle}>{t('noLocationSelected')}</Text>
                <Text style={styles.noMapText}>
                  Press Use Current Location to attach GPS coordinates to the order.
                </Text>
              </View>
            )}

            <View style={styles.savedLocationsCard}>
              <View style={styles.savedLocationsHeaderRow}>
                <View>
                  <Text style={styles.savedLocationsTitle}>{t('savedLocations')}</Text>
                  <Text style={styles.savedLocationsSubtitle}>
                    Save places like Home, Work, or a friend's house.
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.savedLocationsRefreshButton}
                  onPress={() => loadCustomerSavedLocations(customerProfile?.id)}
                >
                  <Text style={styles.savedLocationsRefreshText}>{t('refresh')}</Text>
                </TouchableOpacity>
              </View>

              {savedLocations.length === 0 ? (
                <View style={styles.savedLocationsEmptyBox}>
                  <Text style={styles.savedLocationsEmptyTitle}>{t('noSavedLocationsYet')}</Text>
                  <Text style={styles.savedLocationsEmptyText}>
                    Select your GPS location first, then press Save this location.
                  </Text>
                </View>
              ) : (
                <View style={styles.savedLocationsList}>
                  {savedLocations.map((location) => (
                    <TouchableOpacity
                      key={location.id}
                      style={styles.savedLocationButton}
                      onPress={() => useSavedDeliveryLocation(location)}
                    >
                      <View style={styles.savedLocationIconCircle}>
                        <Text style={styles.savedLocationIconText}>⌂</Text>
                      </View>

                      <View style={styles.savedLocationTextWrap}>
                        <Text style={styles.savedLocationName}>{location.label}</Text>
                        <Text style={styles.savedLocationCoords}>
                          {Number(location.latitude).toFixed(5)}, {Number(location.longitude).toFixed(5)}
                        </Text>
                      </View>

                      <Text style={styles.savedLocationUseText}>{t('use')}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <Text style={styles.inputLabel}>{t('extraAddressDetails')}</Text>
            <TextInput
              style={[styles.formInput, styles.addressInput]}
              placeholder={t('extraAddressPlaceholder')}
              placeholderTextColor="#888"
              multiline
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
            />

            <Text style={styles.inputLabel}>{t('deliveryNote')}</Text>
            <TextInput
              style={styles.formInput}
              placeholder={t('deliveryNotePlaceholder')}
              placeholderTextColor="#888"
              value={deliveryNote}
              onChangeText={setDeliveryNote}
            />
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>{t('deliverySpeed')}</Text>
            <Text style={styles.deliveryStrategyHeadline}>{t('deliveryPromiseShort')}</Text>
            <Text style={styles.deliveryCutoffText}>{t('deliveryCutoffText')}</Text>
            {renderDeliveryOptionCards()}
          </View>

          <View style={styles.formCard}>
            <Text style={styles.formSectionTitle}>{t('paymentMethod')}</Text>

            <View style={styles.paymentRow}>
              <TouchableOpacity
                style={[styles.paymentButton, styles.paymentButtonActive]}
                onPress={() => setPaymentMethod('Cash')}
              >
                <Text style={[styles.paymentButtonText, styles.paymentButtonTextActive]}>
                  {t('cashOnDelivery')}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: '#777777', fontSize: 12, fontWeight: '800', lineHeight: 18, marginTop: 10 }}>
              Card payments are not enabled in this launch test build. No online payment is processed in the app.
            </Text>
          </View>

          <View style={styles.orderReviewCard}>
            <Text style={styles.formSectionTitle}>{t('orderReview')}</Text>

            {cartItems.map((item) => {
              const reviewProduct = productsForPricing.find((product) => product.id === getCartProductId(item));
              const reviewUnitPrice = reviewProduct ? getDisplayUnitPrice(reviewProduct) : item.priceNumber;
              const reviewDiscountInfo = reviewProduct ? getProductDiscountInfo(reviewProduct) : null;

              return (
                <View key={item.id} style={styles.reviewItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.reviewItemName}>
                      {item.quantity} x {getDisplayCartItemName(item)}
                    </Text>
                    {reviewDiscountInfo?.qualifies ? (
                      <Text style={styles.reviewItemDiscountText}>
                        Promo price: {money(reviewUnitPrice)} JOD each | Save {money(reviewDiscountInfo.savings * item.quantity)} JOD
                      </Text>
                    ) : reviewDiscountInfo ? (
                      <Text style={styles.reviewItemDiscountText}>
                        Add {money(reviewDiscountInfo.amountNeeded)} JOD to cart to save {money(reviewDiscountInfo.discountPercent)}%
                      </Text>
                    ) : null}
                  </View>
                  <Text style={styles.reviewItemPrice}>
                    {(item.quantity * reviewUnitPrice).toFixed(2)} JOD
                  </Text>
                </View>
              );
            })}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('subtotal')}</Text>
              <Text style={styles.totalValue}>{subtotal.toFixed(2)} JOD</Text>
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{selectedDeliveryDisplayLabel}</Text>
              <Text style={styles.totalValue}>{customerDeliveryFee.toFixed(2)} JOD</Text>
            </View>
            <Text style={styles.deliveryStrategyText}>{selectedDeliveryConfig.etaLabel}</Text>

            {customerOrderSavingsTotal > 0 && (
              <View style={styles.savingsNoticeBox}>
                <Text style={styles.savingsNoticeText}>
                  You saved {customerOrderSavingsTotal.toFixed(2)} JOD on this order
                </Text>
                <Text style={styles.savingsNoticeSubText}>
                  Item sale prices are already included in the subtotal. Free Next-Day Delivery is covered by Darik when the order is over 10.00 JOD.
                </Text>
              </View>
            )}

            {darikCreditToApply > 0 && (
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: '#078C3B', fontWeight: '900' }]}>{t('darikCreditFromReturns')}</Text>
                <Text style={[styles.totalValue, { color: '#078C3B', fontWeight: '900' }]}>- {darikCreditToApply.toFixed(2)} JOD</Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>{t('grandTotal')}</Text>
              <Text style={styles.grandTotalValue}>{total.toFixed(2)} JOD</Text>
            </View>

            {customerAccountRestricted && (
              <View
                style={{
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: '#FCA5A5',
                  backgroundColor: '#FEE2E2',
                  padding: 12,
                  marginTop: 12,
                }}
              >
                <Text style={{ color: '#991B1B', fontSize: 13, fontWeight: '900', lineHeight: 18 }}>
                  {customerRestrictionMessage}
                </Text>
              </View>
            )}

            {!canPlaceOrder && (
              <Text style={styles.validationText}>
                {customerAccountRestricted
                  ? customerRestrictionMessage
                  : deliveryCoverageValidationText ||
                    (selectedDeliveryOption === 'next_day_free' && !freeNextDayUnlocked
                      ? `Free Next-Day Delivery requires ${money(FREE_NEXT_DAY_MIN_ORDER)} JOD or more. Add ${money(freeNextDayAmountNeeded)} JOD more or choose Express if you are within ${EXPRESS_DELIVERY_RADIUS_KM} km.`
                      : 'Complete name, phone, and delivery GPS location to place order.')}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.placeOrderButton,
                (!canPlaceOrder || placingOrder) && styles.placeOrderButtonDisabled,
              ]}
              disabled={!canPlaceOrder || placingOrder}
              onPress={placeOrder}
            >
              <Text style={styles.placeOrderButtonText}>
                {placingOrder ? t('pleaseWait') : customerAccountRestricted ? 'Account Restricted' : 'Place Order'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      <Modal
        visible={customerOtherOptionsVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setCustomerOtherOptionsVisible(false)}
      >
        <View style={styles.optionsOverlay}>
          <View style={styles.optionsSheet}>
            <View style={styles.cartHandle} />
            <View style={styles.cartHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.optionsTitle}>{t('otherOptions')}</Text>
                <Text style={styles.optionsSubtitle}>{t('menuSubtitle')}</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setCustomerOtherOptionsVisible(false)}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.optionsMenuButton}
              onPress={() => {
                setCustomerOtherOptionsVisible(false);
                setCustomerSettingsVisible(true);
              }}
            >
              <View>
                <Text style={styles.optionsMenuButtonTitle}>{t('customerSettings')}</Text>
                <Text style={styles.optionsMenuButtonSub}>{t('settingsSubtitle')}</Text>
              </View>
              <Text style={styles.optionsMenuChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionsMenuButton} onPress={toggleCustomerLanguage}>
              <View>
                <Text style={styles.optionsMenuButtonTitle}>{t('changeLanguage')}</Text>
                <Text style={styles.optionsMenuButtonSub}>
                  {t('currentLanguage')}: {appLanguage === 'ar' ? t('arabic') : t('english')}
                </Text>
              </View>
              <Text style={styles.optionsMenuChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionsMenuButton} onPress={() => openCustomerOrderHistoryFromMenu()}>
              <View>
                <Text style={styles.optionsMenuButtonTitle}>{t('seeOrderHistory')}</Text>
                <Text style={styles.optionsMenuButtonSub}>{t('orderHistory')}</Text>
              </View>
              <Text style={styles.optionsMenuChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionsMenuButton} onPress={openCustomerSupportFromMenu}>
              <View>
                <Text style={styles.optionsMenuButtonTitle}>{t('contactSupport')}</Text>
                <Text style={styles.optionsMenuButtonSub}>{t('support')}</Text>
              </View>
              <Text style={styles.optionsMenuChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionsMenuButton} onPress={openCustomerChangePasswordFromMenu}>
              <View>
                <Text style={styles.optionsMenuButtonTitle}>{t('changeYourPassword')}</Text>
                <Text style={styles.optionsMenuButtonSub}>{t('passwordChangeHelp')}</Text>
              </View>
              <Text style={styles.optionsMenuChevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={customerSettingsVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setCustomerSettingsVisible(false)}
      >
        <View style={styles.optionsOverlay}>
          <View style={styles.optionsSheet}>
            <View style={styles.cartHandle} />
            <View style={styles.cartHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.optionsTitle}>{t('customerSettings')}</Text>
                <Text style={styles.optionsSubtitle}>{t('settingsSubtitle')}</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setCustomerSettingsVisible(false)}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.accountInfoCard}>
              <Text style={styles.accountInfoTitle}>{t('accountInformation')}</Text>
              <Text style={styles.accountInfoLine}>{t('signedInAs')}: {customerProfile?.full_name || customerSession?.user?.email || '-'}</Text>
              <Text style={styles.accountInfoLine}>{t('fullName')}: {customerProfile?.full_name || customerName || '-'}</Text>
              <Text style={styles.accountInfoLine}>{t('phoneNumber')}: {customerProfile?.phone || customerPhone || '-'}</Text>
              <Text style={styles.accountInfoLine}>{t('email')}: {customerSession?.user?.email || loginEmail || '-'}</Text>
              <Text style={styles.accountInfoLine}>{t('customerNumber')}: {customerProfile?.customer_number || '-'}</Text>

              <View style={styles.settingsCreditCard}>
                <Text style={styles.settingsCreditLabel}>{t('darikCreditBalance')}</Text>
                <Text style={styles.settingsCreditValue}>{money(availableDarikCredit)} JOD</Text>
                <Text style={styles.settingsCreditHelp}>{t('creditAutoApplied')}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.optionsMenuButton, { borderColor: '#FFD23F' }]}
              onPress={() => {
                setCustomerSettingsVisible(false);
                handleCustomerLogout();
              }}
            >
              <View>
                <Text style={styles.optionsMenuButtonTitle}>{t('logout')}</Text>
                <Text style={styles.optionsMenuButtonSub}>{t('signedInAs')} {customerProfile?.full_name || customerSession?.user?.email || ''}</Text>
              </View>
              <Text style={styles.optionsMenuChevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={changePasswordVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setChangePasswordVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.optionsOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.optionsSheet}>
            <View style={styles.cartHandle} />
            <View style={styles.cartHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.optionsTitle}>{t('changeYourPassword')}</Text>
                <Text style={styles.optionsSubtitle}>{t('passwordChangeHelp')}</Text>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setChangePasswordVisible(false)}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>{t('newPassword')}</Text>
            <TextInput
              style={styles.formInput}
              placeholder={t('minimumPasswordPlaceholder')}
              placeholderTextColor="#888"
              secureTextEntry
              value={newCustomerPassword}
              onChangeText={setNewCustomerPassword}
            />

            <Text style={styles.inputLabel}>{t('confirmNewPassword')}</Text>
            <TextInput
              style={styles.formInput}
              placeholder={t('minimumPasswordPlaceholder')}
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmCustomerPassword}
              onChangeText={setConfirmCustomerPassword}
            />

            <TouchableOpacity
              style={[styles.checkoutButton, changePasswordBusy && styles.placeOrderButtonDisabled]}
              onPress={handleCustomerChangePassword}
              disabled={changePasswordBusy}
            >
              <Text style={styles.checkoutButtonText}>
                {changePasswordBusy ? t('updatingPassword') : t('updatePassword')}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={supportVisible}
        animationType="slide"
        onRequestClose={() => setSupportVisible(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: '#F4F5F7' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView style={styles.ordersScreen} contentContainerStyle={styles.ordersContent} keyboardShouldPersistTaps="handled">
            <View style={styles.ordersHeader}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={styles.ordersSmall}>DARIK SUPPORT</Text>
                <Text style={styles.ordersTitle}>{t('supportCenter')}</Text>
                <Text style={styles.ordersSub}>
                  Message Darik admin for order help, delivery problems, payment issues, or app support.
                </Text>
              </View>

              <TouchableOpacity style={styles.ordersCloseButton} onPress={() => setSupportVisible(false)}>
                <Text style={styles.ordersCloseText}>{t('close')}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.refreshOrdersButton}
              onPress={() => loadCustomerSupport(customerProfile?.id)}
            >
              <Text style={styles.refreshOrdersButtonText}>{t('refreshSupport')}</Text>
            </TouchableOpacity>

            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#E7E7E7', marginBottom: 16 }}>
              <Text style={{ color: '#111111', fontSize: 18, fontWeight: '900' }}>{t('newSupportMessage')}</Text>
              <Text style={{ color: '#666666', fontSize: 12, fontWeight: '700', lineHeight: 18, marginTop: 5 }}>
                Darik admin will see this in the Support Inbox.
              </Text>

              {supportRelatedOrderId && (
                <View style={{ marginTop: 12, backgroundColor: '#FFF8D8', borderRadius: 14, padding: 10, borderWidth: 1, borderColor: '#FFD23F' }}>
                  <Text style={{ color: '#111111', fontSize: 12, fontWeight: '900' }}>
                    Related order: {supportRelatedOrderId.slice(0, 8).toUpperCase()}
                  </Text>
                  <TouchableOpacity style={{ marginTop: 6 }} onPress={() => setSupportRelatedOrderId(null)}>
                    <Text style={{ color: '#9C7A00', fontSize: 12, fontWeight: '900' }}>{t('removeRelatedOrder')}</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.inputLabel}>{t('issueType')}</Text>
              <View style={{ gap: 8 }}>
                {CUSTOMER_SUPPORT_ISSUE_TYPES.map((issue) => (
                  <TouchableOpacity
                    key={issue}
                    style={{
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: supportIssueType === issue ? '#111111' : '#DDDDDD',
                      backgroundColor: supportIssueType === issue ? '#FFF8D8' : '#FFFFFF',
                      padding: 11,
                    }}
                    onPress={() => setSupportIssueType(issue)}
                  >
                    <Text style={{ color: '#111111', fontSize: 12, fontWeight: '900' }}>{issue}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>{t('subject')}</Text>
              <TextInput
                style={styles.formInput}
                placeholder={t('deliveryProblemPlaceholder')}
                placeholderTextColor="#888"
                value={supportSubject}
                onChangeText={setSupportSubject}
              />

              <Text style={styles.inputLabel}>{t('message')}</Text>
              <TextInput
                style={[styles.formInput, { minHeight: 110, textAlignVertical: 'top' }]}
                placeholder={t('supportMessagePlaceholder')}
                placeholderTextColor="#888"
                value={supportMessageBody}
                onChangeText={setSupportMessageBody}
                multiline
              />

              <TouchableOpacity
                style={{ marginTop: 14, borderRadius: 18, backgroundColor: '#111111', paddingVertical: 14, alignItems: 'center', opacity: supportBusy ? 0.6 : 1 }}
                onPress={submitSupportThread}
                disabled={supportBusy}
              >
                <Text style={{ color: '#FFD23F', fontSize: 14, fontWeight: '900' }}>
                  {supportBusy ? 'Sending...' : 'Send Support Message'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{ color: '#111111', fontSize: 20, fontWeight: '900', marginBottom: 10 }}>{t('mySupportTickets')}</Text>

            {supportThreads.length === 0 ? (
              <View style={styles.ordersEmptyCard}>
                <Text style={styles.ordersEmptyTitle}>{t('noSupportTicketsYet')}</Text>
                <Text style={styles.ordersEmptyText}>
                  Send a message above and Darik admin will reply here.
                </Text>
              </View>
            ) : (
              <View style={{ gap: 12 }}>
                {supportThreads.map((thread) => {
                  const selected = selectedSupportThreadId === thread.id;
                  const messages = getSupportMessagesForThread(thread.id);
                  return (
                    <View key={thread.id} style={{ backgroundColor: '#FFFFFF', borderRadius: 22, padding: 14, borderWidth: 1, borderColor: selected ? '#FFD23F' : '#E7E7E7' }}>
                      <TouchableOpacity onPress={() => setSelectedSupportThreadId(selected ? null : thread.id)}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: '#111111', fontSize: 15, fontWeight: '900' }}>{thread.subject}</Text>
                            <Text style={{ color: '#666666', fontSize: 12, fontWeight: '700', marginTop: 4 }}>
                              {thread.issue_type} | {cleanOrderStatus(thread.status)}
                            </Text>
                            {getSupportThreadOrderLabel(thread) ? (
                              <Text style={{ color: '#9C7A00', fontSize: 12, fontWeight: '900', marginTop: 4 }}>{getSupportThreadOrderLabel(thread)}</Text>
                            ) : null}
                          </View>
                          <Text style={{ color: thread.priority === 'urgent' || thread.priority === 'high' ? '#B00020' : '#111111', fontSize: 11, fontWeight: '900' }}>
                            {cleanOrderStatus(thread.priority)}
                          </Text>
                        </View>
                        <Text style={{ color: '#777777', fontSize: 12, fontWeight: '700', lineHeight: 17, marginTop: 8 }}>
                          {thread.last_message_preview || 'Tap to view conversation'}
                        </Text>
                      </TouchableOpacity>

                      {selected && (
                        <View style={{ marginTop: 12, borderTopWidth: 1, borderTopColor: '#EEEEEE', paddingTop: 12 }}>
                          {messages.map((message) => {
                            const isAdmin = message.sender_role === 'admin';
                            return (
                              <View
                                key={message.id}
                                style={{
                                  alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                                  maxWidth: '92%',
                                  backgroundColor: isAdmin ? '#F1F5F9' : '#FFF8D8',
                                  borderRadius: 16,
                                  padding: 11,
                                  marginBottom: 8,
                                  borderWidth: 1,
                                  borderColor: isAdmin ? '#DCE4EF' : '#FFD23F',
                                }}
                              >
                                <Text style={{ color: '#111111', fontSize: 11, fontWeight: '900', marginBottom: 4 }}>
                                  {isAdmin ? 'Darik Support' : 'You'}
                                </Text>
                                <Text style={{ color: '#333333', fontSize: 13, fontWeight: '700', lineHeight: 18 }}>
                                  {message.message_body}
                                </Text>
                                <Text style={{ color: '#777777', fontSize: 10, fontWeight: '700', marginTop: 6 }}>
                                  {formatOrderDate(message.created_at)}
                                </Text>
                              </View>
                            );
                          })}

                          {thread.status !== 'resolved' && thread.status !== 'closed' ? (
                            <>
                              <TextInput
                                style={[styles.formInput, { minHeight: 84, textAlignVertical: 'top', marginTop: 8 }]}
                                placeholder={t('replySupportPlaceholder')}
                                placeholderTextColor="#888"
                                value={supportReplyBody}
                                onChangeText={setSupportReplyBody}
                                multiline
                              />
                              <TouchableOpacity
                                style={{ marginTop: 10, borderRadius: 16, backgroundColor: '#FFD23F', paddingVertical: 12, alignItems: 'center', opacity: supportBusy ? 0.6 : 1 }}
                                onPress={() => submitSupportReply(thread)}
                                disabled={supportBusy}
                              >
                                <Text style={{ color: '#111111', fontSize: 13, fontWeight: '900' }}>
                                  {supportBusy ? 'Sending...' : 'Send Reply'}
                                </Text>
                              </TouchableOpacity>
                            </>
                          ) : (
                            <View style={{ marginTop: 8, backgroundColor: '#DCFCE7', borderRadius: 14, padding: 10, borderWidth: 1, borderColor: '#86EFAC' }}>
                              <Text style={{ color: '#166534', fontSize: 12, fontWeight: '900' }}>{t('ticketResolved')}</Text>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={ordersVisible}
        animationType="slide"
        onRequestClose={() => setOrdersVisible(false)}
      >
        <ScrollView style={styles.ordersScreen} contentContainerStyle={styles.ordersContent}>
          <View style={styles.ordersHeader}>
            <View>
              <Text style={styles.ordersSmall}>{t('darikOrders')}</Text>
              <Text style={styles.ordersTitle}>{t('orderHistory')}</Text>
              <Text style={styles.ordersSub}>
                {t('ordersScreenSubtitle')}
              </Text>
            </View>

            <TouchableOpacity style={styles.ordersCloseButton} onPress={() => setOrdersVisible(false)}>
              <Text style={styles.ordersCloseText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: '#111111', borderRadius: 26, padding: 18, marginBottom: 14, borderWidth: 2, borderColor: '#FFD23F' }}>
            <Text style={{ color: '#FFD23F', fontSize: 12, fontWeight: '900', letterSpacing: 1.2 }}>{t('darikPromise')}</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900', marginTop: 4 }}>{t('shopWithConfidence')}</Text>
            <Text style={{ color: '#E5E7EB', fontSize: 14, fontWeight: '700', lineHeight: 20, marginTop: 8 }}>
              {t('darikPromiseLongText')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <View style={{ backgroundColor: '#FFD23F', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ color: '#111111', fontSize: 12, fontWeight: '900' }}>{t('creditReturnAllowance')}</Text>
              </View>
              <View style={{ backgroundColor: '#FFFFFF', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ color: '#111111', fontSize: 12, fontWeight: '900' }}>{t('returnWindow')}</Text>
              </View>
              <View style={{ backgroundColor: '#DCFCE7', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 }}>
                <Text style={{ color: '#166534', fontSize: 12, fontWeight: '900' }}>{t('freeDefectiveReplacement')}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: '#1F2937', borderRadius: 18, padding: 12, marginTop: 14 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '900' }}>
                {t('freeReturnsRemainingThisMonth')}: {getFreeReturnsRemainingThisMonth()}
              </Text>
              <Text style={{ color: '#D1D5DB', fontSize: 12, fontWeight: '700', lineHeight: 18, marginTop: 4 }}>
                {getFreeReturnsRemainingThisMonth() > 0
                  ? (appLanguage === 'ar'
                    ? `لديك ${getFreeReturnsRemainingThisMonth()} ${getFreeReturnsRemainingThisMonth() === 1 ? 'مرة إرجاع مجانية' : 'مرات إرجاع مجانية'} متبقية هذا الشهر. المستخدم: ${getFreeReturnsUsedThisMonth()}/3. يتجدد الإرجاع المجاني بتاريخ ${getNextFreeReturnsResetDateLabel()}. رسوم الاستلام القادمة: ${money(getNextReturnPickupFeeAmount())} JOD.`
                    : `You have ${getFreeReturnsRemainingThisMonth()} free return pickup${getFreeReturnsRemainingThisMonth() === 1 ? '' : 's'} left this month. Used: ${getFreeReturnsUsedThisMonth()}/3. Your free returns reset on ${getNextFreeReturnsResetDateLabel()}. Next return pickup fee: ${money(getNextReturnPickupFeeAmount())} JOD.`)
                  : (appLanguage === 'ar'
                    ? `لقد استخدمت كل 3 مرات الإرجاع المجانية هذا الشهر. يتجدد الإرجاع المجاني بتاريخ ${getNextFreeReturnsResetDateLabel()}. رسوم الاستلام القادمة: ${money(getNextReturnPickupFeeAmount())} JOD.`
                    : `You have used all 3 free return pickups this month. Your free returns reset on ${getNextFreeReturnsResetDateLabel()}. Next return pickup fee: ${money(getNextReturnPickupFeeAmount())} JOD.`)}
              </Text>
              <Text style={{ color: '#FFD23F', fontSize: 12, fontWeight: '900', marginTop: 8 }}>
                {t('freeReturnsResetDate')}: {getNextFreeReturnsResetDateLabel()}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.refreshOrdersButton}
            onPress={() => loadCustomerOrders(customerProfile?.id)}
          >
            <Text style={styles.refreshOrdersButtonText}>{t('refreshOrders')}</Text>
          </TouchableOpacity>

          {customerOrders.length === 0 ? (
            <View style={styles.ordersEmptyCard}>
              <Text style={styles.ordersEmptyTitle}>{t('noOrdersYet')}</Text>
              <Text style={styles.ordersEmptyText}>
                {t('ordersEmptyText')}
              </Text>
            </View>
          ) : (
            <View style={styles.ordersList}>
              {customerOrders.map((order) => {
                const isOutForDelivery = order.order_status === 'out_for_delivery';
                const isPreparing = isPreparingOrder(order.order_status);
                const isCancelled = isCancelledOrder(order.order_status);
                const orderItems = getCustomerOrderItems(order.id);

                return (
                  <TouchableOpacity
                    key={order.id}
                    style={[styles.customerOrderCard, isCancelled && styles.customerOrderCardCancelled]}
                    onPress={() => openCustomerOrder(order)}
                  >
                    <View style={styles.customerOrderTopRow}>
                      <View>
                        <Text style={styles.customerOrderTitle}>
                          {t('orderWord')} {order.id.slice(0, 8).toUpperCase()}
                        </Text>
                        <Text style={styles.customerOrderDate}>
                          {formatOrderDate(order.created_at)}
                        </Text>
                      </View>

                      <View
                        style={[
                          styles.customerOrderStatusPill,
                          isCancelled
                            ? styles.orderStatusCancelled
                            : isOutForDelivery
                              ? styles.orderStatusOut
                              : isPreparing
                                ? styles.orderStatusPreparing
                                : styles.orderStatusDelivered,
                        ]}
                      >
                        <Text style={styles.customerOrderStatusText}>
                          {cleanOrderStatus(order.order_status)}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.customerOrderMeta}>
                      {orderItems.length} {orderItems.length === 1 ? t('oneItem') : t('manyItems')} | {money(order.total)} JOD
                    </Text>
                    <Text style={styles.customerOrderDeliveryMeta}>
                      {getOrderDeliveryLabel(order)} | {getOrderDeliveryEtaLabel(order)} | {t('deliveryWord')} {money(getCustomerPaidDeliveryFeeForOrder(order))} JOD
                    </Text>

                    {isCustomerExchangeDeliveryOrder(order) && (
                      <View style={{ marginTop: 10, borderRadius: 16, backgroundColor: '#FFF8D8', borderWidth: 1, borderColor: '#FFD23F', padding: 10 }}>
                        <Text style={{ color: '#111111', fontSize: 12, fontWeight: '900' }}>{t('replacementExchangeDelivery')}</Text>
                        <Text style={{ color: '#6B5A00', fontSize: 11, fontWeight: '800', lineHeight: 16, marginTop: 3 }}>
                          {t('replacementExchangeHelpText')}
                        </Text>
                      </View>
                    )}

                    {renderCancellationRequestStatus(order)}

                    {renderInlineCancellationForm(order)}

                    {getCancellationRequestForOrder(order.id)?.request_status === 'pending' && (
                      <View style={{ marginTop: 10, borderRadius: 16, backgroundColor: '#FFF8D8', borderWidth: 1, borderColor: '#FFD23F', padding: 10 }}>
                        <Text style={{ color: '#111111', fontSize: 12, fontWeight: '900' }}>{t('cancellationPendingReview')}</Text>
                      </View>
                    )}

                    {canRequestCancellation(order) && (
                      <TouchableOpacity
                        style={{ marginTop: 10, borderRadius: 16, backgroundColor: '#111111', paddingVertical: 10, alignItems: 'center' }}
                        onPress={() => startInlineCancellationRequest(order)}
                      >
                        <Text style={{ color: '#FFD23F', fontSize: 12, fontWeight: '900' }}>{t('requestCancellation')}</Text>
                      </TouchableOpacity>
                    )}

                    {order.order_status === 'delivered' && !isCancelled && (
                      <View style={{ marginTop: 10, borderRadius: 18, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', padding: 12 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10, alignItems: 'center' }}>
                          <View style={{ flex: 1 }}>
                            <Text style={{ color: '#111111', fontSize: 13, fontWeight: '900' }}>{t('darikPromiseReturnWindow')}</Text>
                            <Text style={{ color: '#6B7280', fontSize: 12, fontWeight: '700', marginTop: 3 }}>
                              {t('returnWindowInlineHelp')}
                            </Text>
                          </View>
                          <View style={{ backgroundColor: canRequestDarikReturnForOrder(order) ? '#DCFCE7' : '#FEE2E2', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 }}>
                            <Text style={{ color: canRequestDarikReturnForOrder(order) ? '#166534' : '#991B1B', fontSize: 11, fontWeight: '900' }}>{canRequestDarikReturnForOrder(order) ? t('openWord') : t('closedWord')}</Text>
                          </View>
                        </View>

                        {orderItems.map((item) => {
                          const existingReturn = getReturnRequestForItem(item.id);
                          return (
                            <View key={`return-${item.id}`} style={{ marginTop: 10, borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', padding: 10 }}>
                              <Text style={{ color: '#111111', fontSize: 12, fontWeight: '900' }}>{getOrderItemDisplayName(item)}</Text>
                              <Text style={{ color: '#6B7280', fontSize: 11, fontWeight: '700', marginTop: 2 }}>{t('creditReturnGrossValueLine')}: {money(item.line_total)} JOD | {t('exactReplacementFreeIfDefective')}</Text>
                              {existingReturn ? (
                                <View style={{ marginTop: 8, borderRadius: 14, backgroundColor: existingReturn.status === 'cancelled_by_customer' ? '#F3F4F6' : '#FFF8D8', paddingVertical: 9, paddingHorizontal: 10 }}>
                                  <Text style={{ color: '#111111', fontSize: 11, fontWeight: '900' }}>{getReturnStatusLabel(existingReturn.status)}</Text>
                                  <Text style={{ color: '#6B7280', fontSize: 10, fontWeight: '700', marginTop: 2 }}>
                                    {existingReturn.status === 'cancelled_by_customer'
                                      ? t('returnCancelledByYouText')
                                      : isExactReplacementReturn(existingReturn)
                                        ? t('replacementSelectedApprovedText')
                                        : t('creditIssuedAfterInspectionText')}
                                  </Text>
                                  <Text style={{ color: '#111111', fontSize: 10, fontWeight: '900', marginTop: 5 }}>
                                    {t('optionWord')}: {getReturnResolutionLabel(existingReturn)}
                                  </Text>
                                  {isExactReplacementReturn(existingReturn) ? (
                                    <Text style={{ color: '#166534', fontSize: 10, fontWeight: '800', marginTop: 3 }}>
                                      {t('freeReplacementExchangeText')} {existingReturn.replacement_size_label ? `${t('replacementSizeWord')}: ${existingReturn.replacement_size_label}. ` : ''}{existingReturn.replacement_order_status ? `${t('replacementStatusWord')}: ${cleanOrderStatus(existingReturn.replacement_order_status)}` : ''}
                                    </Text>
                                  ) : (
                                    <Text style={{ color: '#6B7280', fontSize: 10, fontWeight: '800', marginTop: 3 }}>
                                      {t('grossCredit')}: {money(existingReturn.line_total)} JOD | {t('pickupFeeDeductedFromCreditShort')}: {money(getReturnCreditPickupFeeToDeduct(existingReturn))} JOD | {t('netCredit')}: {money(getReturnNetCreditAmount(existingReturn, item.line_total))} JOD
                                    </Text>
                                  )}
                                  {canCancelDarikReturnRequest(existingReturn) && (
                                    <TouchableOpacity
                                      disabled={returnRequestBusyItemId === item.id}
                                      style={{ marginTop: 8, borderRadius: 12, backgroundColor: '#FEE2E2', paddingVertical: 9, alignItems: 'center' }}
                                      onPress={() => cancelDarikReturnRequest(existingReturn, item)}
                                    >
                                      <Text style={{ color: '#991B1B', fontSize: 11, fontWeight: '900' }}>
                                        {returnRequestBusyItemId === item.id ? t('cancelling') : t('cancelReturnRequestButton')}
                                      </Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              ) : (
                                <TouchableOpacity
                                  disabled={!canRequestDarikReturnForOrder(order) || returnRequestBusyItemId === item.id}
                                  style={{ marginTop: 8, borderRadius: 14, backgroundColor: canRequestDarikReturnForOrder(order) ? '#111111' : '#D1D5DB', paddingVertical: 10, alignItems: 'center' }}
                                  onPress={() => requestDarikReturn(order, item)}
                                >
                                  <Text style={{ color: canRequestDarikReturnForOrder(order) ? '#FFD23F' : '#6B7280', fontSize: 11, fontWeight: '900' }}>{returnRequestBusyItemId === item.id ? t('submitting') : t('returnReplaceThisItem')}</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    )}

                    <TouchableOpacity
                      style={{ marginTop: 10, borderRadius: 16, backgroundColor: '#FFD23F', paddingVertical: 10, alignItems: 'center' }}
                      onPress={() => openSupportCenter(order)}
                    >
                      <Text style={{ color: '#111111', fontSize: 12, fontWeight: '900' }}>{t('contactSupportOrder')}</Text>
                    </TouchableOpacity>

                    {isCancelled && (
                      <View style={styles.cancelledOrderNotice}>
                        <Text style={styles.cancelledOrderNoticeTitle}>{t('orderCancelled')}</Text>
                        <Text style={styles.cancelledOrderNoticeText}>{getCancelledOrderText(order)}</Text>
                      </View>
                    )}

                    {!isCancelled && isPreparing && !shouldShowCustomerDeliveryPin(order) && (
                      <View style={styles.preparingOrderNotice}>
                        <Text style={styles.preparingOrderNoticeText}>
                          {t('orderPreparingPinLater')}
                        </Text>
                      </View>
                    )}

                    {!isCancelled && shouldShowCustomerDriverProgress(order) && (
                      <View style={styles.orderProgressPreview}>
                        <Text style={styles.orderProgressPreviewLabel}>{t('liveDeliveryProgress')}</Text>
                        <Text style={styles.orderProgressPreviewText}>{getCustomerDriverProgressLabel(order)}</Text>
                      </View>
                    )}

                    {!isCancelled && shouldShowCustomerDeliveryPin(order) && (
                      <View style={styles.orderPinPreview}>
                        <Text style={styles.orderPinPreviewLabel}>{getCustomerDeliveryPinLabel(order)}</Text>
                        <Text style={styles.orderPinPreviewNumber}>
                          {order.delivery_pin || '----'}
                        </Text>
                        <Text style={{ color: '#E5E7EB', fontSize: 11, fontWeight: '800', lineHeight: 16, textAlign: 'center', marginTop: 6 }}>
                          {getCustomerDeliveryPinHelpText(order)}
                        </Text>
                      </View>
                    )}

                    <Text style={styles.customerOrderTap}>{t('seeDetails')}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </Modal>

      <Modal
        visible={orderDetailVisible && !!selectedCustomerOrder}
        animationType="slide"
        onRequestClose={closeOrderDetailAndReturnToHistory}
      >
        {selectedCustomerOrder && (
          <ScrollView style={styles.ordersScreen} contentContainerStyle={styles.ordersContent}>
            <View style={styles.ordersHeader}>
              <View>
                <Text style={styles.ordersSmall}>{t('orderDetails')}</Text>
                <Text style={styles.ordersTitle}>
                  {t('orderWord')} {selectedCustomerOrder.id.slice(0, 8).toUpperCase()}
                </Text>
                <Text style={styles.ordersSub}>
                  {t('statusWord')}: {cleanOrderStatus(selectedCustomerOrder.order_status)}
                </Text>
              </View>

              <TouchableOpacity style={styles.ordersCloseButton} onPress={closeOrderDetailAndReturnToHistory}>
                <Text style={styles.ordersCloseText}>{t('back')}</Text>
              </TouchableOpacity>
            </View>

            {isCancelledOrder(selectedCustomerOrder.order_status) && (
              <View style={styles.detailCancelledCard}>
                <Text style={styles.detailCancelledTitle}>{t('orderCancelled')}</Text>
                <Text style={styles.detailCancelledText}>{getCancelledOrderText(selectedCustomerOrder)}</Text>
                {selectedCustomerOrder.cancelled_at ? (
                  <Text style={styles.detailCancelledMeta}>
                    {t('cancelledOn')}: {formatOrderDate(selectedCustomerOrder.cancelled_at)}
                  </Text>
                ) : null}
              </View>
            )}

            {!isCancelledOrder(selectedCustomerOrder.order_status) && isPreparingOrder(selectedCustomerOrder.order_status) && !shouldShowCustomerDeliveryPin(selectedCustomerOrder) && (
              <View style={styles.detailPreparingCard}>
                <Text style={styles.detailPreparingTitle}>{t('yourOrderPrepared')}</Text>
                <Text style={styles.detailPreparingText}>
                  {t('weWillShowDeliveryPin')}
                </Text>
              </View>
            )}

            {!isCancelledOrder(selectedCustomerOrder.order_status) && shouldShowCustomerDeliveryPin(selectedCustomerOrder) && (
              <View style={styles.detailPinCard}>
                <Text style={styles.detailPinLabel}>{getCustomerDeliveryPinLabel(selectedCustomerOrder)}</Text>
                <Text style={styles.detailPinNumber}>
                  {selectedCustomerOrder.delivery_pin || '----'}
                </Text>
                <Text style={styles.detailPinWarning}>
                  {getCustomerDeliveryPinHelpText(selectedCustomerOrder)}
                </Text>
              </View>
            )}



            {!isCancelledOrder(selectedCustomerOrder.order_status) && shouldShowCustomerDriverProgress(selectedCustomerOrder) && (
              <View style={styles.detailProgressCard}>
                <Text style={styles.detailProgressTitle}>{t('liveDeliveryProgress')}</Text>
                <Text style={styles.detailProgressText}>{getCustomerDriverProgressLabel(selectedCustomerOrder)}</Text>
              </View>
            )}

            {renderCancellationRequestStatus(selectedCustomerOrder)}

            {renderInlineCancellationForm(selectedCustomerOrder)}

            <TouchableOpacity
              style={{ marginTop: 12, marginBottom: 12, borderRadius: 18, backgroundColor: '#FFD23F', paddingVertical: 13, alignItems: 'center' }}
              onPress={() => {
                setOrderDetailVisible(false);
                setTimeout(() => openSupportCenter(selectedCustomerOrder), 140);
              }}
            >
              <Text style={{ color: '#111111', fontSize: 13, fontWeight: '900' }}>{t('contactSupportOrder')}</Text>
            </TouchableOpacity>

            <View style={styles.orderDetailCard}>
              <Text style={styles.orderDetailSectionTitle}>{t('items')}</Text>
              {getCustomerOrderItems(selectedCustomerOrder.id).map((item) => (
                <View key={item.id} style={styles.orderDetailItemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderDetailItemName}>{getOrderItemDisplayName(item)}</Text>
                    <Text style={styles.orderDetailItemMeta}>
                      {t('qtyWord')} {item.quantity} × {money(item.app_price)} JOD{item.size_label_snapshot ? ` | ${t('sizeWord')} ${item.size_label_snapshot}` : ''}
                    </Text>
                  </View>
                  <Text style={styles.orderDetailItemTotal}>
                    {money(item.line_total)} JOD
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.orderDetailCard}>
              <Text style={styles.orderDetailSectionTitle}>{t('paymentSummary')}</Text>
              <View style={styles.orderDetailSummaryRow}>
                <Text style={styles.orderDetailSummaryLabel}>{t('subtotal')}</Text>
                <Text style={styles.orderDetailSummaryValue}>{money(selectedCustomerOrder.subtotal)} JOD</Text>
              </View>
              <View style={styles.orderDetailSummaryRow}>
                <Text style={styles.orderDetailSummaryLabel}>{t('deliveryOption')}</Text>
                <Text style={styles.orderDetailSummaryValue}>{getOrderDeliveryLabel(selectedCustomerOrder)}</Text>
              </View>
              <Text style={styles.orderDetailDeliveryEtaText}>{getOrderDeliveryEtaLabel(selectedCustomerOrder)}</Text>
              <View style={styles.orderDetailSummaryRow}>
                <Text style={styles.orderDetailSummaryLabel}>{t('deliveryFee')}</Text>
                <Text style={styles.orderDetailSummaryValue}>{money(getCustomerPaidDeliveryFeeForOrder(selectedCustomerOrder))} JOD</Text>
              </View>
              {getDeliverySavingsForOrder(selectedCustomerOrder) > 0 && (
                <Text style={styles.orderDetailFreeDeliveryText}>
                  {t('freeNextDayAppliedSavings')} {money(getDeliverySavingsForOrder(selectedCustomerOrder))} JOD {t('comparedToExpressDelivery')}
                </Text>
              )}
              <View style={styles.orderDetailSummaryRow}>
                <Text style={styles.orderDetailSummaryLabel}>{t('grandTotal')}</Text>
                <Text style={styles.orderDetailSummaryTotal}>{money(selectedCustomerOrder.total)} JOD</Text>
              </View>
              <Text style={styles.orderDetailPayment}>
                {t('paymentWord')}: {cleanOrderStatus(selectedCustomerOrder.payment_method)}
              </Text>
            </View>

            {(selectedCustomerOrder.delivery_address_details || selectedCustomerOrder.delivery_note) && (
              <View style={styles.orderDetailCard}>
                <Text style={styles.orderDetailSectionTitle}>{t('deliveryDetails')}</Text>
                {selectedCustomerOrder.delivery_address_details ? (
                  <Text style={styles.orderDetailText}>{selectedCustomerOrder.delivery_address_details}</Text>
                ) : null}
                {selectedCustomerOrder.delivery_note ? (
                  <Text style={styles.orderDetailText}>{t('noteWord')}: {selectedCustomerOrder.delivery_note}</Text>
                ) : null}
              </View>
            )}
          </ScrollView>
        )}
      </Modal>

      <Modal
        visible={saveLocationVisible}
        animationType="fade"
        transparent
        onRequestClose={() => closeSaveLocationModal(true)}
      >
        <View style={styles.saveLocationOverlay}>
          <View style={styles.saveLocationModalCard}>
            <Text style={styles.saveLocationModalTitle}>{t('nameThisLocation')}</Text>
            <Text style={styles.saveLocationModalText}>
              Example: Home, Work, Friend's House, Mom's House.
            </Text>

            <Text style={styles.inputLabel}>{t('locationName')}</Text>
            <TextInput
              style={styles.formInput}
              placeholder={t('locationPlaceholder')}
              placeholderTextColor="#888"
              value={saveLocationLabel}
              onChangeText={setSaveLocationLabel}
              autoFocus
            />

            {deliveryLocation ? (
              <View style={styles.saveLocationPreviewBox}>
                <Text style={styles.saveLocationPreviewText}>
                  GPS: {deliveryLocation.latitude.toFixed(6)}, {deliveryLocation.longitude.toFixed(6)}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.saveLocationConfirmButton, savingLocation && styles.saveLocationConfirmButtonDisabled]}
              onPress={confirmSaveCurrentDeliveryLocation}
              disabled={savingLocation}
            >
              <Text style={styles.saveLocationConfirmText}>
                {savingLocation ? 'Saving...' : 'Save Location'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveLocationCancelButton}
              onPress={() => closeSaveLocationModal(true)}
            >
              <Text style={styles.saveLocationCancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={orderPlacedVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setOrderPlacedVisible(false)}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successCircle}>
              <Text style={styles.successCheck}>✓</Text>
            </View>

            <Text style={styles.successTitle}>{t('orderPlaced')}</Text>
            <Text style={styles.successText}>
              Your order has been saved to Supabase. Delivery speed: {lastOrderConfirmation?.deliveryEtaLabel || selectedDeliveryConfig.etaLabel}.
            </Text>

            <View style={styles.deliveryPinCard}>
              <Text style={styles.deliveryPinLabel}>{t('yourDeliveryPin')}</Text>
              <Text style={styles.deliveryPinNumber}>
                {placedOrderDeliveryPin || '----'}
              </Text>
              <Text style={styles.deliveryPinWarning}>
                Only give this PIN to the Darik driver when you are receiving your order.
              </Text>
            </View>

            <View style={styles.successSummary}>
              <Text style={styles.successLine}>Customer: {lastOrderConfirmation?.customerName || customerName}</Text>
              <Text style={styles.successLine}>Payment: {lastOrderConfirmation?.paymentMethod || paymentMethod}</Text>
              {Number(lastOrderConfirmation?.promotionDiscountTotal ?? promotionDiscountTotal) > 0 && (
                <Text style={styles.successLine}>Item sale savings included: {money(lastOrderConfirmation?.promotionDiscountTotal ?? promotionDiscountTotal)} JOD</Text>
              )}
              <Text style={styles.successLine}>Delivery: {lastOrderConfirmation?.deliveryLabel || selectedDeliveryStoredLabel} ({money(lastOrderConfirmation?.deliveryFee ?? deliveryFee)} JOD)</Text>
              {Number(lastOrderConfirmation?.darikCreditAppliedAmount ?? darikCreditToApply) > 0 && (
                <Text style={styles.successLine}>Darik Credit applied: - {money(lastOrderConfirmation?.darikCreditAppliedAmount ?? darikCreditToApply)} JOD</Text>
              )}
              <Text style={styles.successLine}>ETA: {lastOrderConfirmation?.deliveryEtaLabel || selectedDeliveryConfig.etaLabel}</Text>
              <Text style={styles.successLine}>Total due: {money(lastOrderConfirmation?.total ?? total)} JOD</Text>
              {(lastOrderConfirmation?.deliveryLocation || deliveryLocation) && (
                <Text style={styles.successLine}>
                  GPS: {(lastOrderConfirmation?.deliveryLocation || deliveryLocation)!.latitude.toFixed(5)}, {(lastOrderConfirmation?.deliveryLocation || deliveryLocation)!.longitude.toFixed(5)}
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.doneButton} onPress={startNewOrder}>
              <Text style={styles.doneButtonText}>{t('done')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  loadingScreen: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingLogoCard: {
    width: 190,
    height: 190,
    backgroundColor: '#0E0E10',
    borderRadius: 42,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1C1C1E',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
  loadingLogoImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  loadingTitle: { marginTop: 18, fontSize: 26, fontWeight: '900', color: '#FFF500', textAlign: 'center' },
  loadingText: { marginTop: 8, color: '#FFF500', fontWeight: '700' },
  screen: { flex: 1, backgroundColor: '#F4F5F7' },
  content: { padding: 18, paddingTop: 60, paddingBottom: 40 },

  authKeyboardView: { flex: 1, backgroundColor: '#F4F5F7' },
  authScreen: { flex: 1, backgroundColor: '#F4F5F7' },
  authContent: { padding: 22, paddingTop: 70, paddingBottom: 40 },
  authLogoCard: {
    height: 118,
    backgroundColor: '#0E0E10',
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1C1C1E',
  },
  authLogoImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  authTitle: { marginTop: 24, fontSize: 34, fontWeight: '900', color: '#111', lineHeight: 39 },
  authSubtitle: { marginTop: 8, fontSize: 15, color: '#666', lineHeight: 22, fontWeight: '700' },
  authModeRow: {
    marginTop: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 5,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    flexDirection: 'row',
  },
  authModeButton: { flex: 1, borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  authModeButtonActive: { backgroundColor: '#111' },
  authModeButtonText: { color: '#666', fontWeight: '900', fontSize: 14 },
  authModeButtonTextActive: { color: '#FFD23F' },
  authCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  authCardTitle: { fontSize: 22, fontWeight: '900', color: '#111', marginBottom: 12 },
  rememberRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  rememberBox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  rememberBoxActive: { backgroundColor: '#FFD23F' },
  rememberCheck: { color: '#111', fontWeight: '900', fontSize: 16 },
  rememberTextWrap: { flex: 1 },
  rememberTitle: { fontSize: 14, fontWeight: '900', color: '#111' },
  rememberSubtitle: { marginTop: 3, fontSize: 12, fontWeight: '700', color: '#666' },
  authSubmitButton: {
    marginTop: 16,
    backgroundColor: '#FFD23F',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  authSubmitButtonDisabled: { opacity: 0.55 },
  authSubmitButtonText: { color: '#111', fontSize: 15, fontWeight: '900' },

  forgotPasswordButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 8,
  },
  forgotPasswordButtonText: {
    color: '#0F62FE',
    fontSize: 13,
    fontWeight: '900',
    textDecorationLine: 'underline',
  },
  passwordResetBox: {
    marginTop: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 12,
  },
  passwordResetButton: {
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    alignItems: 'center',
  },
  passwordResetButtonText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '900',
  },
  passwordResetHelpText: {
    marginTop: 9,
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
    textAlign: 'center',
  },

  signupCodeButton: {
    marginTop: 12,
    marginBottom: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    alignItems: 'center',
  },
  signupCodeButtonText: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '900',
  },
  signupCodeHelp: {
    marginTop: 6,
    marginBottom: 10,
    color: '#666666',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },

  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brandLogoCard: {
    flex: 1,
    height: 126,
    backgroundColor: '#0E0E10',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandLogoImage: {
    width: '114%',
    height: '114%',
    resizeMode: 'cover',
  },
  cartIconCard: {
    width: 108,
    height: 52,
    backgroundColor: '#0E0E10',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartIcon: {
    color: '#FFD23F',
    fontSize: 14,
    fontWeight: '900',
  },
  cartIconBadge: {
    position: 'absolute',
    top: -7,
    right: -7,
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3D25A',
    borderWidth: 3,
    borderColor: '#F4F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
  },
  cartIconBadgeText: {
    color: '#111',
    fontWeight: '900',
    fontSize: 15,
  },

  locationCard: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 18,
    paddingVertical: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationTitle: { fontSize: 21, fontWeight: '900', color: '#111' },
  locationSub: { marginTop: 6, fontSize: 13, color: '#666', maxWidth: 260, fontWeight: '700' },
  locationDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#F3D25A',
    marginLeft: 14,
  },
  heroPromoCard: {
    marginBottom: 14,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#242424',
    backgroundColor: '#0E0E10',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  heroPromoTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  heroPromoLogoWrap: {
    width: 94,
    height: 38,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#050505',
    borderWidth: 1,
    borderColor: '#232323',
  },
  heroPromoLogo: {
    width: '130%',
    height: '130%',
    marginLeft: -11,
    marginTop: -6,
  },
  heroPromoPromisePill: {
    backgroundColor: '#FFD23F',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  heroPromoPromiseText: {
    color: '#111111',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  heroPromoHeadline: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  heroPromoHeadlineYellow: {
    color: '#FFD23F',
  },
  heroPromoPromiseRow: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  heroPromoPromiseItem: {
    color: '#EAEAEA',
    fontSize: 11,
    fontWeight: '800',
  },
  heroPromoDot: {
    color: '#FFD23F',
    fontSize: 12,
    fontWeight: '900',
  },
  mockTopShell: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingHorizontal: 2,
    paddingVertical: 4,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mockMenuButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  mockMenuIcon: {
    color: '#111111',
    fontSize: 21,
    fontWeight: '900',
    lineHeight: 24,
  },
  mockHeaderLogoWrap: {
    flex: 1,
    height: 74,
    marginHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockHeaderLogo: {
    width: 221,
    height: 95,
  },
  mockCartButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  mockCartGlyph: {
    color: '#111111',
    fontSize: 22,
  },
  mockCartBadge: {
    position: 'absolute',
    top: -2,
    right: -1,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD400',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  mockCartBadgeText: {
    color: '#111111',
    fontWeight: '900',
    fontSize: 13,
  },
  mockSearchWrapper: {
    marginBottom: 14,
    zIndex: 20,
  },
  mockSearchShell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    paddingHorizontal: 18,
    minHeight: 58,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 7 },
    elevation: 2,
  },
  mockSearchIcon: {
    color: '#111111',
    fontSize: 24,
    marginRight: 12,
    lineHeight: 24,
  },
  mockSearchInput: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
    fontSize: 17,
    color: '#111111',
  },
  mockTrustGrid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginBottom: 12,
    columnGap: 6,
  },
  mockTrustCard: {
    width: '24%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    paddingHorizontal: 8,
    paddingVertical: 10,
    minHeight: 84,
    justifyContent: 'center',
  },
  mockTrustTitle: {
    color: '#111111',
    fontSize: 10.5,
    fontWeight: '900',
    lineHeight: 13,
  },
  mockTrustSubtitle: {
    color: '#6E6E6E',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 12,
  },
  customerAccountRow: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerAccountLabel: { fontSize: 11, fontWeight: '900', color: '#777' },
  customerAccountName: { marginTop: 3, fontSize: 13, fontWeight: '900', color: '#111' },
  logoutButton: { backgroundColor: '#111', borderRadius: 13, paddingVertical: 9, paddingHorizontal: 13 },
  logoutButtonText: { color: '#FFD23F', fontSize: 12, fontWeight: '900' },

  cartCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartText: { color: '#FFD23F', fontWeight: '900', fontSize: 16 },
  searchWrapper: { marginTop: 20, zIndex: 20 },
  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  searchDropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    overflow: 'hidden',
  },
  searchSuggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  searchSuggestionImage: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  searchSuggestionImageText: { fontSize: 9, fontWeight: '900', color: '#111' },
  searchSuggestionImageReal: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    resizeMode: 'cover',
  },
  searchSuggestionMiddle: { flex: 1 },
  searchSuggestionName: { fontSize: 13, fontWeight: '900', color: '#111' },
  searchSuggestionCategory: { marginTop: 3, fontSize: 11, color: '#777' },
  searchSuggestionPrice: { fontSize: 12, fontWeight: '900', color: '#111' },
  adBannerWrapper: {
    marginTop: 4,
  },
  adBannerOuterWrap: {
    marginRight: 0,
  },
  adBannerOutsideLabel: {
    marginBottom: 7,
    marginLeft: 4,
    color: '#111',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  adBannerCard: {
    width: '100%',
    height: 220,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  adBannerBackgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    opacity: 1,
  },
  adBannerCleanOverlay: {
    flex: 1,
    padding: 10,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    pointerEvents: 'none',
  },
  adBannerMinimalTopPill: {
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  adBannerMinimalTopText: {
    color: '#FFD23F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  adBannerMinimalBottomPill: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFD23F',
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.18)',
  },
  adBannerMinimalBottomText: {
    color: '#111',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.7,
  },
  adBannerOverlay: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adBannerTextArea: {
    flex: 1,
    paddingRight: 12,
  },
  adBannerSponsored: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  adBannerSponsoredPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  adBannerSponsoredPillText: {
    color: '#FFD23F',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  adBannerStoreIntro: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  adBannerSponsorName: {
    marginTop: 3,
    fontSize: 30,
    fontWeight: '900',
    lineHeight: 34,
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  adBannerHeadline: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 24,
  },
  adBannerSubheadline: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    opacity: 0.92,
  },
  adBannerCta: {
    marginTop: 14,
    alignSelf: 'flex-start',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  adBannerCtaText: {
    color: '#111',
    fontSize: 12,
    fontWeight: '900',
  },
  adBannerBadge: {
    width: 74,
    height: 74,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adBannerBadgeTop: { color: '#111', fontSize: 12, fontWeight: '900' },
  adBannerBadgeBottom: { marginTop: 2, color: '#111', fontSize: 14, fontWeight: '900' },
  adBannerStoreBadgeWrap: {
    width: 88,
    alignItems: 'center',
    gap: 8,
  },
  adBannerStoreBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    opacity: 0.9,
  },
  adBannerDots: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  adBannerDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#CFCFCF',
  },
  adBannerDotActive: {
    width: 20,
    backgroundColor: '#111',
  },
  productSortCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 22,
    padding: 12,
    marginTop: 8,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  productSortLabel: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productSortChip: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 13,
    marginRight: 8,
  },
  productSortChipActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  productSortChipText: {
    color: '#333333',
    fontSize: 12,
    fontWeight: '900',
  },
  productSortChipTextActive: {
    color: '#FFD23F',
  },
  retailerFilterCard: {
    marginBottom: 14,
    backgroundColor: '#111',
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  retailerFilterLabel: {
    color: '#D8D8D8',
    fontSize: 11,
    fontWeight: '800',
  },
  retailerFilterName: {
    marginTop: 3,
    color: '#FFD23F',
    fontSize: 16,
    fontWeight: '900',
  },
  retailerFilterClearButton: {
    backgroundColor: '#FFD23F',
    borderRadius: 13,
    paddingVertical: 9,
    paddingHorizontal: 13,
  },
  retailerFilterClearText: {
    color: '#111',
    fontSize: 12,
    fontWeight: '900',
  },

  hero: {
    marginTop: 18,
    backgroundColor: '#111',
    borderRadius: 26,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroLeft: { flex: 1, paddingRight: 12 },
  heroSmall: { color: '#FFD23F', fontSize: 12, fontWeight: '900', letterSpacing: 0.8 },
  heroTitle: { marginTop: 9, color: '#FFFFFF', fontSize: 31, fontWeight: '900', lineHeight: 36 },
  heroText: { marginTop: 10, color: '#D8D8D8', fontSize: 14, lineHeight: 21 },
  heroButton: {
    marginTop: 18,
    backgroundColor: '#FFD23F',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  heroButtonText: { color: '#111', fontWeight: '900' },
  heroBadge: {
    width: 88,
    height: 110,
    borderRadius: 22,
    backgroundColor: '#FFD23F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBadgeTop: { fontSize: 11, fontWeight: '900', color: '#111' },
  heroBadgeNumber: { fontSize: 46, fontWeight: '900', color: '#111', lineHeight: 50 },
  heroBadgeBottom: { fontSize: 12, fontWeight: '900', color: '#111' },
  promiseRow: { marginTop: 14, flexDirection: 'row', justifyContent: 'space-between' },
  promiseCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  promiseTitle: { fontSize: 14, fontWeight: '900', color: '#111' },
  promiseText: { marginTop: 5, fontSize: 12, lineHeight: 17, color: '#666' },
  cartSummary: {
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartSummaryTitle: { fontSize: 16, fontWeight: '900', color: '#111' },
  cartSummaryText: { marginTop: 4, fontSize: 13, color: '#666' },
  cartSummaryRight: { alignItems: 'flex-end' },
  cartSummaryTotal: { fontSize: 17, fontWeight: '900', color: '#111' },
  cartSummarySmall: { marginTop: 4, fontSize: 11, color: '#777' },
  sectionRow: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#111' },
  viewAll: { fontSize: 13, color: '#777', fontWeight: '700' },
  clothingFilterCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  clothingFilterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
  },
  clothingFilterTitle: { color: '#111', fontSize: 17, fontWeight: '900' },
  clothingFilterSub: { marginTop: 3, color: '#777', fontSize: 12, fontWeight: '700', lineHeight: 17 },
  clothingFilterResetButton: {
    backgroundColor: '#111',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clothingFilterResetText: { color: '#FFD23F', fontSize: 12, fontWeight: '900' },
  clothingFilterChip: {
    backgroundColor: '#F6F6F6',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  clothingFilterChipActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  clothingFilterChipText: { color: '#111', fontSize: 12, fontWeight: '900' },
  clothingFilterChipTextActive: { color: '#FFD23F' },
  clothingFilterHint: { marginTop: 10, color: '#777', fontSize: 12, fontWeight: '800', lineHeight: 18 },
  clothingFilterSecondTitle: { marginTop: 14, marginBottom: 8, color: '#111', fontSize: 14, fontWeight: '900' },
  categoryScrollContent: {
    paddingRight: 18,
    paddingBottom: 6,
    paddingTop: 2,
  },
  categoryGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryCard: {
    width: 74,
    marginRight: 12,
    alignItems: 'center',
  },
  categoryCardShell: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    padding: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  categoryCardSelectedShell: {
    borderColor: 'transparent',
    borderWidth: 0,
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  categoryCardActive: {},
  categoryImageCard: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7E7E7',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  categoryBestSellersImageCard: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#FFD23F',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  categoryBestSellersIcon: {
    color: '#FFD23F',
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  categoryImageCardActive: {
    borderColor: '#FFD23F',
    borderWidth: 2,
  },
  categoryAllImageCard: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111111',
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryAllTopBadge: {
    display: 'none',
  },
  categoryAllTopBadgeText: {
    color: '#111',
    fontSize: 6,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  categoryAllIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  categoryAllIconText: {
    fontSize: 16,
  },
  categoryAllTitle: {
    display: 'none',
  },
  categoryAllTitleActive: { color: '#FFD23F' },
  categoryAllSubtitle: {
    display: 'none',
  },
  categoryAllSubtitleActive: { color: '#F2F2F2' },
  categoryPreviewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    resizeMode: 'cover',
    backgroundColor: '#FFFFFF',
  },
  categoryImageGradientOverlay: {
    display: 'none',
  },
  categorySelectedBadge: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#FFD23F',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  categorySelectedBadgeText: {
    display: 'none',
  },
  categoryPreviewPlaceholder: {
    flex: 1,
    width: '100%',
    borderRadius: 999,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  categoryPreviewPlaceholderText: {
    color: '#666',
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 10,
  },
  categoryPreviewEmoji: {
    fontSize: 26,
    lineHeight: 30,
  },
  categoryPreviewEmojiText: {
    display: 'none',
  },
  categoryPreviewPlaceholderTextActive: { color: '#111' },
  categoryLabelPill: {
    display: 'none',
  },
  categoryLabelPillActive: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  categoryLabelTextWrap: {
    flex: 1,
    paddingRight: 0,
  },
  categoryImageLabel: {
    marginTop: 7,
    fontSize: 11,
    fontWeight: '900',
    color: '#111',
    lineHeight: 13,
    textAlign: 'center',
    minHeight: 26,
  },
  categoryImageLabelActive: { color: '#111' },
  categoryMicroCopy: {
    display: 'none',
  },
  categoryMicroCopyActive: {
    color: '#5C4A00',
  },
  categoryLabelArrow: {
    display: 'none',
  },
  categoryLabelArrowActive: {
    backgroundColor: '#111',
    color: '#FFD23F',
    borderColor: '#111',
  },
  bestSellerDepartmentStack: {
    gap: 26,
  },
  bestSellerDepartmentSection: {
    gap: 12,
  },
  bestSellerDepartmentHeader: {
    minHeight: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bestSellerDepartmentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  bestSellerDepartmentCountText: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '900',
  },
  bestSellerDepartmentTitle: {
    color: '#111111',
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
    letterSpacing: 0.2,
    paddingRight: 18,
  },
  bestSellerCarouselContent: {
    paddingRight: 18,
    columnGap: 18,
  },
  bestSellerCleanItem: {
    width: 154,
    backgroundColor: 'transparent',
  },
  bestSellerCleanImageWrap: {
    width: 154,
    height: 154,
    backgroundColor: 'transparent',
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestSellerCleanImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  bestSellerCleanPlaceholder: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestSellerCleanPlaceholderText: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '900',
  },
  bestSellerCleanName: {
    marginTop: 10,
    color: '#2E5F87',
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 20,
  },
  bestSellerLoadMoreCategoriesCard: {
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginHorizontal: 2,
    marginTop: 2,
    marginBottom: 10,
  },
  bestSellerLoadMoreCategoriesIcon: {
    color: '#111111',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
  },
  bestSellerLoadMoreCategoriesTitle: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  bestSellerLoadMoreCategoriesSub: {
    color: '#777777',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 4,
  },
  bestSellerLoadMoreCard: {
    width: 104,
    height: 150,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
    paddingHorizontal: 10,
  },
  bestSellerLoadMoreIcon: {
    color: '#111111',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 6,
  },
  bestSellerLoadMoreText: {
    color: '#555555',
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 15,
  },
  bestSellerCleanPrice: {
    marginTop: 4,
    color: '#111111',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
  },
  bestSellerCleanFreeBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    borderRadius: 999,
    backgroundColor: '#0B7A31',
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  bestSellerCleanFreeBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  bestSellerSideButton: {
    minWidth: 92,
    borderRadius: 999,
    backgroundColor: '#111111',
    paddingVertical: 8,
    paddingHorizontal: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestSellerSideButtonText: {
    color: '#FFD23F',
    fontSize: 10,
    fontWeight: '900',
  },
  bestSellerSideSpacer: {
    minWidth: 92,
  },
  bestSellerMiniProductRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    columnGap: 8,
  },
  bestSellerMiniProductCard: {
    width: '23.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    padding: 6,
    alignItems: 'center',
  },
  bestSellerMiniImageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestSellerMiniImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
  },
  bestSellerMiniPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bestSellerMiniPlaceholderText: {
    color: '#111111',
    fontSize: 11,
    fontWeight: '900',
  },
  bestSellerMiniPrice: {
    marginTop: 6,
    color: '#111111',
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 13,
    textAlign: 'center',
  },
  bestSellerMiniFreeBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    borderRadius: 999,
    backgroundColor: '#0B7A31',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  bestSellerMiniFreeBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  productGrid: {
    gap: 12,
  },
  productCard: {
    width: '100%',
    minHeight: 124,
    backgroundColor: 'transparent',
    borderRadius: 0,
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginBottom: 6,
    borderWidth: 0,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'visible',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
  },
  freeShippingSticker: {
    position: 'absolute',
    top: 4,
    left: 4,
    zIndex: 5,
    backgroundColor: '#0B7A31',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  freeShippingStickerText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  productHorizontalImageWrap: {
    width: 112,
    height: 112,
    borderRadius: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  productHorizontalInfo: {
    flex: 1,
    minHeight: 108,
    paddingLeft: 14,
    justifyContent: 'space-between',
  },
  productTopLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  productHeart: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent',
    color: '#111111',
    textAlign: 'center',
    lineHeight: 27,
    fontSize: 22,
    fontWeight: '900',
    overflow: 'hidden',
  },
  productPriceAndDelivery: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },
  productActionSlot: {
    minWidth: 62,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  productImagePlaceholder: {
    height: 112,
    borderRadius: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  productVisualCompact: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productVisualCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  productVisualCode: { color: '#111', fontWeight: '900', fontSize: 13 },
  productImageText: {
    color: '#555',
    fontWeight: '900',
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  productImageReal: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
  badge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF4BF',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  badgeText: { color: '#111', fontSize: 11, fontWeight: '900' },
  productName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#111111',
    lineHeight: 19,
  },
  productCategory: {
    marginTop: 4,
    fontSize: 12,
    color: '#777777',
    fontWeight: '800',
  },
  productBottom: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 8,
  },
  productBottomStacked: { flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', gap: 8 },
  productPrice: { fontSize: 16, fontWeight: '900', color: '#111', lineHeight: 19, flexShrink: 1 },
  productDeliveryLine: {
    marginTop: 5,
    color: '#0B7A31',
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 14,
  },
  discountPriceCardBlock: { flex: 0, minWidth: 0, flexShrink: 1, paddingRight: 0 },
  discountPriceDetailBlock: { marginTop: 14 },
  discountPriceCartBlock: { marginTop: 5 },
  discountPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 7, flexWrap: 'wrap', minWidth: 0 },
  oldPriceText: {
    color: '#777',
    fontSize: 12,
    fontWeight: '900',
    textDecorationLine: 'line-through',
  },
  oldPriceTextDetail: { fontSize: 16 },
  newPriceText: { color: '#B00020', fontSize: 14, fontWeight: '900' },
  newPriceTextDetail: { fontSize: 27, color: '#111' },
  savingsText: {
    marginTop: 3,
    color: '#0B7A31',
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 14,
  },
  discountUnlockText: {
    marginTop: 3,
    color: '#9C7A00',
    fontSize: 10,
    fontWeight: '900',
    lineHeight: 14,
  },
  searchSuggestionPriceWrap: { alignItems: 'flex-end' },
  searchSuggestionDiscountText: {
    marginTop: 2,
    color: '#0B7A31',
    fontSize: 10,
    fontWeight: '900',
  },
  reviewItemDiscountText: {
    marginTop: 4,
    color: '#0B7A31',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
  },
  deliveryStrategyHeadline: {
    marginTop: -4,
    marginBottom: 12,
    color: '#111',
    fontSize: 13,
    fontWeight: '900',
  },
  deliveryStrategyText: {
    marginTop: -3,
    marginBottom: 9,
    color: '#555',
    fontSize: 12,
    fontWeight: '800',
  },
  deliveryCutoffText: {
    marginTop: -6,
    marginBottom: 12,
    color: '#666',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  deliveryOptionStack: { gap: 10 },
  deliveryOptionCard: {
    borderWidth: 1,
    borderColor: '#E2E2E2',
    backgroundColor: '#F8F8F8',
    borderRadius: 18,
    padding: 14,
  },
  deliveryOptionCardActive: {
    backgroundColor: '#111',
    borderColor: '#111',
  },
  deliveryOptionCardDisabled: {
    opacity: 0.62,
  },
  deliveryOptionMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  deliveryOptionTextWrap: { flex: 1 },
  deliveryOptionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  deliveryOptionRadio: { color: '#111', fontSize: 16, fontWeight: '900' },
  deliveryOptionRadioActive: { color: '#FFD23F' },
  deliveryOptionTitle: { color: '#111', fontSize: 15, fontWeight: '900' },
  deliveryOptionTitleActive: { color: '#FFD23F' },
  deliveryOptionTextDisabled: { color: '#888' },
  deliveryOptionSub: { marginTop: 3, color: '#666', fontSize: 12, fontWeight: '800' },
  deliveryOptionSubActive: { color: '#FFFFFF' },
  deliveryOptionPriceWrap: { alignItems: 'flex-end', gap: 2 },
  deliveryOptionPrice: { color: '#111', fontSize: 14, fontWeight: '900' },
  deliveryOptionPriceActive: { color: '#FFD23F' },
  deliveryOptionSmallTag: { color: '#777', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  deliveryOptionSmallTagActive: { color: '#FFFFFF' },
  deliveryOptionDescription: { marginTop: 9, color: '#666', fontSize: 12, fontWeight: '700', lineHeight: 17 },
  deliveryOptionDescriptionActive: { color: '#EDEDED' },
  customerOrderDeliveryMeta: { marginTop: 4, color: '#555', fontSize: 12, fontWeight: '800', lineHeight: 17 },
  addButton: { backgroundColor: '#111111', borderRadius: 14, paddingVertical: 9, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0, minWidth: 62 },
  chooseSizeButton: { backgroundColor: '#111111', borderRadius: 14, paddingHorizontal: 12, paddingVertical: 9, minWidth: 82, minHeight: 36 },
  addButtonText: { color: '#FFD23F', fontWeight: '900', fontSize: 12, textAlign: 'center' },
  productQuantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 3,
    gap: 4,
  },
  productQuantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD23F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productQuantityButtonText: {
    color: '#111',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 20,
  },
  productQuantityText: {
    minWidth: 22,
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  noResultsCard: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 22, borderWidth: 1, borderColor: '#E7E7E7', alignItems: 'center' },
  noResultsTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  noResultsText: { marginTop: 6, fontSize: 13, color: '#666', textAlign: 'center' },
  storeScreen: { flex: 1, backgroundColor: '#F4F5F7' },
  storeContent: { padding: 18, paddingTop: 58, paddingBottom: 40 },
  storeHero: {
    minHeight: 300,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#111',
    marginBottom: 14,
  },
  storeHeroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.36,
  },
  storeHeroOverlay: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  storeBackButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD23F',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  storeBackButtonText: { color: '#111', fontWeight: '900', fontSize: 13 },
  storeHeroTopRow: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeSponsoredPill: {
    backgroundColor: 'rgba(255,210,63,0.16)',
    borderColor: '#FFD23F',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 11,
  },
  storeSponsoredPillText: {
    color: '#FFD23F',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  storeProductCount: { color: '#FFFFFF', fontSize: 12, fontWeight: '900' },
  storeName: {
    marginTop: 14,
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 41,
    fontWeight: '900',
  },
  storeSubtitle: {
    marginTop: 8,
    color: '#E8E8E8',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  storeOfferCard: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  storeOfferTitle: { color: '#FFD23F', fontSize: 15, fontWeight: '900' },
  storeOfferText: { marginTop: 5, color: '#FFFFFF', fontSize: 13, fontWeight: '800', lineHeight: 19 },
  storeInfoStrip: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  storeInfoBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    alignItems: 'center',
  },
  storeInfoNumber: { color: '#111', fontSize: 17, fontWeight: '900' },
  storeInfoLabel: { marginTop: 3, color: '#666', fontSize: 10, fontWeight: '900', textAlign: 'center' },
  storeSectionRow: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
  },
  storeSectionTitle: { flex: 1, color: '#111', fontSize: 22, fontWeight: '900', lineHeight: 27 },
  storeSectionCount: { color: '#777', fontSize: 12, fontWeight: '900' },
  detailScreen: { flex: 1, backgroundColor: '#F4F5F7' },
  detailContent: { padding: 18, paddingTop: 58, paddingBottom: 34 },
  detailHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  detailImageBox: { height: 280, borderRadius: 28, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7E7E7', justifyContent: 'center', alignItems: 'center', padding: 24 },
  detailProductImageReal: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
  },
  detailPhotoCounterPill: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  detailPhotoCounterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  detailPhotoArrowRow: {
    position: 'absolute',
    left: 12,
    right: 12,
    top: '43%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    pointerEvents: 'box-none',
  },
  detailPhotoArrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailPhotoArrowButtonDisabled: {
    opacity: 0.25,
  },
  detailPhotoArrowText: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '900',
  },
  detailThumbnailScroll: {
    marginTop: 12,
    marginHorizontal: 18,
    maxHeight: 78,
  },
  detailThumbnailButton: {
    width: 70,
    height: 70,
    borderRadius: 18,
    marginRight: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E6E6E6',
    backgroundColor: '#F6F6F6',
  },
  detailThumbnailButtonActive: {
    borderColor: '#FFD23F',
  },
  detailThumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailProductMockup: { width: '82%', height: '86%', borderRadius: 26, backgroundColor: '#EFEFEF', borderWidth: 1, borderColor: '#E2E2E2', justifyContent: 'center', alignItems: 'center', padding: 18 },
  detailProductMockupTop: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  detailProductMockupCode: { color: '#FFD23F', fontSize: 24, fontWeight: '900' },
  detailProductMockupName: { fontSize: 21, fontWeight: '900', color: '#111', letterSpacing: 1, textAlign: 'center' },
  detailProductMockupCategory: { marginTop: 8, fontSize: 14, fontWeight: '800', color: '#666', textAlign: 'center' },
  detailBadgeRow: { marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  detailRating: { flex: 1, textAlign: 'right', fontSize: 12, fontWeight: '800', color: '#666' },
  detailProductName: { marginTop: 14, fontSize: 31, lineHeight: 36, fontWeight: '900', color: '#111' },
  detailCategory: { marginTop: 7, fontSize: 14, color: '#666', fontWeight: '800' },
  detailSoldBy: { marginTop: 7, fontSize: 14, color: '#111', fontWeight: '900' },
  detailFreeShippingBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#111',
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#FFD23F',
  },
  detailFreeShippingBadgeText: {
    color: '#FFD23F',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  productOfferText: { marginTop: 8, color: '#0B8A3A', fontSize: 13, fontWeight: '900', lineHeight: 18 },
  detailPrice: { marginTop: 14, fontSize: 26, fontWeight: '900', color: '#111' },
  detailCard: { marginTop: 16, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#E7E7E7' },
  detailSectionTitle: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 10 },
  detailDescription: { fontSize: 14, lineHeight: 22, color: '#555', fontWeight: '600' },
  reviewBox: { backgroundColor: '#F6F6F6', borderRadius: 16, padding: 13, marginBottom: 10 },
  reviewName: { fontSize: 13, fontWeight: '900', color: '#111' },
  reviewText: { marginTop: 5, fontSize: 13, color: '#666', lineHeight: 19 },
  detailBottomBar: { marginTop: 16, backgroundColor: '#111', borderRadius: 22, padding: 16, gap: 14 },
  detailBottomActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  detailQuantitySelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#222', borderRadius: 16, padding: 6 },
  detailQuantityButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFD23F', justifyContent: 'center', alignItems: 'center' },
  detailQuantityButtonText: { color: '#111', fontSize: 20, fontWeight: '900', lineHeight: 22 },
  detailQuantityText: { minWidth: 34, textAlign: 'center', color: '#FFFFFF', fontSize: 17, fontWeight: '900' },
  detailBottomLabel: { fontSize: 12, fontWeight: '800', color: '#D8D8D8' },
  detailBottomPrice: { marginTop: 4, fontSize: 20, fontWeight: '900', color: '#FFD23F' },
  detailAddButton: { flex: 1, backgroundColor: '#FFD23F', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, alignItems: 'center' },
  detailAddButtonText: { color: '#111', fontWeight: '900', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  cartSheet: { height: '92%', maxHeight: '92%', backgroundColor: '#F4F5F7', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 18, paddingBottom: 18, overflow: 'hidden' },
  cartHandle: { width: 46, height: 5, borderRadius: 99, backgroundColor: '#C9C9C9', alignSelf: 'center', marginBottom: 16 },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cartTitle: { fontSize: 25, fontWeight: '900', color: '#111' },
  cartSubtitle: { marginTop: 4, fontSize: 13, color: '#666' },
  closeButton: { backgroundColor: '#111', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 14 },
  closeButtonText: { color: '#FFD23F', fontWeight: '900', fontSize: 12 },
  emptyCart: { marginTop: 30, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E7E7E7' },
  emptyCartTitle: { fontSize: 18, fontWeight: '900', color: '#111' },
  emptyCartText: { marginTop: 7, fontSize: 13, color: '#666' },
  cartItemsArea: { marginTop: 16, maxHeight: 360 },
  cartFullScrollArea: { marginTop: 16, flex: 1, minHeight: 0 },
  cartFullScrollContent: { paddingBottom: 34, flexGrow: 0 },
  cartItemsListBox: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 12, borderWidth: 1, borderColor: '#E7E7E7' },
  cartItemsListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  cartItemsListTitle: { color: '#111', fontSize: 18, fontWeight: '900' },
  cartItemsListSubtitle: { marginTop: 4, color: '#666', fontSize: 12, fontWeight: '700' },
  cartItemsListCount: { backgroundColor: '#111', color: '#FFD23F', overflow: 'hidden', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 10, fontSize: 12, fontWeight: '900' },
  cartItem: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E7E7E7', flexDirection: 'row', alignItems: 'center' },
  cartItemImage: { width: 64, height: 64, borderRadius: 16, backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center', marginRight: 12, borderWidth: 1, borderColor: '#E2E2E2', overflow: 'hidden' },
  cartItemImageReal: { width: '100%', height: '100%', resizeMode: 'contain', backgroundColor: '#FFFFFF' },
  cartItemImageText: { fontSize: 10, fontWeight: '900', color: '#111' },
  cartItemMiddle: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: '900', color: '#111', lineHeight: 18 },
  cartItemCategory: { marginTop: 3, fontSize: 12, color: '#777' },
  cartItemPrice: { marginTop: 5, fontSize: 12, color: '#111', fontWeight: '800' },
  cartItemActionRow: {
    marginTop: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  saveForLaterText: { fontSize: 12, color: '#9C7A00', fontWeight: '900' },
  removeText: { fontSize: 12, color: '#B00020', fontWeight: '900' },
  savedForLaterBox: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  savedForLaterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  savedForLaterTitle: { color: '#111', fontSize: 18, fontWeight: '900' },
  savedForLaterSubtitle: {
    marginTop: 4,
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    maxWidth: 220,
  },
  savedForLaterClearText: { color: '#B00020', fontSize: 12, fontWeight: '900' },
  savedForLaterItem: {
    backgroundColor: '#F7F7F7',
    borderRadius: 18,
    padding: 11,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  savedForLaterImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E2E2',
    overflow: 'hidden',
  },
  savedForLaterMiddle: { flex: 1 },
  savedForLaterItemName: { color: '#111', fontSize: 13, fontWeight: '900', lineHeight: 17 },
  savedForLaterItemMeta: { marginTop: 3, color: '#777', fontSize: 11, fontWeight: '700' },
  savedForLaterActions: { alignItems: 'flex-end', gap: 8 },
  moveToCartButton: {
    backgroundColor: '#FFD23F',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  moveToCartButtonText: { color: '#111', fontSize: 11, fontWeight: '900' },
  savedForLaterRemoveText: { color: '#B00020', fontSize: 11, fontWeight: '900' },
  quantityBox: { alignItems: 'center', marginLeft: 10 },
  quantityButton: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
  quantityButtonText: { color: '#FFD23F', fontSize: 20, fontWeight: '900', lineHeight: 22 },
  quantityText: { marginVertical: 8, fontSize: 16, fontWeight: '900', color: '#111' },
  cartDeliveryChoiceTitle: { color: '#111', fontSize: 15, fontWeight: '900', marginBottom: 4 },
  cartDeliveryChoiceSubtitle: { color: '#666', fontSize: 12, fontWeight: '700', lineHeight: 17, marginBottom: 10 },
  cartSummaryDivider: { height: 1, backgroundColor: '#E7E7E7', marginVertical: 12 },
  checkoutBox: { marginTop: 12, backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#E7E7E7' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  totalLabel: { fontSize: 14, color: '#666', fontWeight: '700' },
  totalValue: { fontSize: 14, color: '#111', fontWeight: '900' },
  promotionValue: { fontSize: 14, color: '#0B8A3A', fontWeight: '900' },
  promotionText: { marginTop: -2, marginBottom: 9, color: '#0B8A3A', fontSize: 12, fontWeight: '800', lineHeight: 17 },
  savingsNoticeBox: { marginTop: 10, backgroundColor: '#EAF8EF', borderWidth: 1, borderColor: '#9ED8B3', borderRadius: 16, paddingVertical: 11, paddingHorizontal: 13 },
  savingsNoticeText: { color: '#0B8A3A', fontSize: 13, fontWeight: '900', textAlign: 'center' },
  savingsNoticeSubText: { marginTop: 3, color: '#0B8A3A', fontSize: 11, fontWeight: '700', textAlign: 'center' },
  divider: { height: 1, backgroundColor: '#E7E7E7', marginVertical: 8 },
  grandTotalLabel: { fontSize: 18, color: '#111', fontWeight: '900' },
  grandTotalValue: { fontSize: 18, color: '#111', fontWeight: '900' },
  checkoutButton: { marginTop: 14, backgroundColor: '#FFD23F', borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  checkoutButtonText: { color: '#111', fontWeight: '900', fontSize: 15 },
  clearCartButton: { marginTop: 10, paddingVertical: 12, alignItems: 'center' },
  clearCartText: { color: '#B00020', fontWeight: '900', fontSize: 13 },
  checkoutScreen: { flex: 1, backgroundColor: '#F4F5F7' },
  checkoutContent: { padding: 18, paddingTop: 58, paddingBottom: 38 },
  checkoutHeader: { marginBottom: 18 },
  backButton: { alignSelf: 'flex-start', backgroundColor: '#111', borderRadius: 14, paddingVertical: 10, paddingHorizontal: 16, marginBottom: 18 },
  backButtonText: { color: '#FFD23F', fontWeight: '900' },
  checkoutTitle: { fontSize: 32, fontWeight: '900', color: '#111' },
  checkoutSubtitle: { marginTop: 6, fontSize: 14, color: '#666' },
  formCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#E7E7E7', marginBottom: 14 },
  formSectionTitle: { fontSize: 18, fontWeight: '900', color: '#111', marginBottom: 14 },
  inputLabel: { fontSize: 13, color: '#333', fontWeight: '900', marginBottom: 7, marginTop: 6 },
  formInput: { backgroundColor: '#F6F6F6', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, borderWidth: 1, borderColor: '#E2E2E2', color: '#111' },
  addressInput: { minHeight: 78, textAlignVertical: 'top' },
  locationHelpText: { fontSize: 13, color: '#666', lineHeight: 19, marginBottom: 13 },
  locationMainButton: { backgroundColor: '#111', borderRadius: 15, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  locationMainButtonText: { color: '#FFD23F', fontWeight: '900', fontSize: 13 },
  gpsCard: { backgroundColor: '#F6F6F6', borderRadius: 18, padding: 15, borderWidth: 1, borderColor: '#E2E2E2', marginBottom: 12 },
  gpsTitle: { fontSize: 15, fontWeight: '900', color: '#111', marginBottom: 7 },
  gpsText: { fontSize: 12, color: '#333', fontWeight: '700', marginBottom: 4 },
  embeddedMapCard: {
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D7D7D7',
    backgroundColor: '#E5E7EB',
    marginTop: 12,
  },
  embeddedMap: {
    width: '100%',
    height: '100%',
  },
  googleMapsButton: { marginTop: 12, backgroundColor: '#111', borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  googleMapsButtonText: { color: '#FFD23F', fontWeight: '900', fontSize: 12 },
  saveLocationButton: { marginTop: 10, backgroundColor: '#FFD23F', borderRadius: 14, paddingVertical: 13, alignItems: 'center' },
  saveLocationButtonText: { color: '#111', fontWeight: '900', fontSize: 12 },
  noMapBox: { backgroundColor: '#F6F6F6', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#E2E2E2', marginBottom: 12, alignItems: 'center' },
  noMapTitle: { fontSize: 16, fontWeight: '900', color: '#111' },
  noMapText: { marginTop: 6, textAlign: 'center', fontSize: 13, color: '#666', lineHeight: 19 },
  locationSecondaryButton: { backgroundColor: '#FFD23F', borderRadius: 15, paddingVertical: 14, alignItems: 'center', marginBottom: 12 },
  locationSecondaryButtonText: { color: '#111', fontWeight: '900', fontSize: 13 },
  paymentRow: { flexDirection: 'row', gap: 10 },
  paymentButton: { flex: 1, borderRadius: 15, paddingVertical: 13, alignItems: 'center', backgroundColor: '#F6F6F6', borderWidth: 1, borderColor: '#E2E2E2' },
  paymentButtonActive: { backgroundColor: '#111', borderColor: '#111' },
  paymentButtonText: { fontWeight: '900', color: '#111' },
  paymentButtonTextActive: { color: '#FFD23F' },
  orderReviewCard: { backgroundColor: '#FFFFFF', borderRadius: 22, padding: 16, borderWidth: 1, borderColor: '#E7E7E7' },
  reviewItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 11, gap: 12 },
  reviewItemName: { flex: 1, fontSize: 13, fontWeight: '800', color: '#111' },
  reviewItemPrice: { fontSize: 13, fontWeight: '900', color: '#111' },
  validationText: { marginTop: 10, color: '#B00020', fontSize: 12, fontWeight: '800', lineHeight: 17 },
  placeOrderButton: { marginTop: 14, backgroundColor: '#FFD23F', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  placeOrderButtonDisabled: { opacity: 0.45 },
  placeOrderButtonText: { color: '#111', fontWeight: '900', fontSize: 15 },
  successOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 22 },
  successCard: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 24, alignItems: 'center' },
  successCircle: { width: 78, height: 78, borderRadius: 39, backgroundColor: '#FFD23F', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  successCheck: { fontSize: 42, fontWeight: '900', color: '#111' },
  successTitle: { fontSize: 28, fontWeight: '900', color: '#111' },
  successText: { marginTop: 9, textAlign: 'center', fontSize: 14, color: '#666', lineHeight: 21 },
  deliveryPinCard: {
    alignSelf: 'stretch',
    marginTop: 18,
    backgroundColor: '#111',
    borderRadius: 22,
    padding: 18,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD23F',
  },
  deliveryPinLabel: { color: '#FFFFFF', fontSize: 13, fontWeight: '900' },
  deliveryPinNumber: {
    marginTop: 8,
    color: '#FFD23F',
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 8,
  },
  deliveryPinWarning: {
    marginTop: 9,
    color: '#E8E8E8',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
    textAlign: 'center',
  },
  successSummary: { alignSelf: 'stretch', marginTop: 18, backgroundColor: '#F6F6F6', borderRadius: 18, padding: 14 },
  successLine: { fontSize: 13, color: '#111', fontWeight: '800', marginBottom: 6 },
  doneButton: { alignSelf: 'stretch', marginTop: 18, backgroundColor: '#111', borderRadius: 16, paddingVertical: 15, alignItems: 'center' },
  doneButtonText: { color: '#FFD23F', fontWeight: '900', fontSize: 15 },

  headerActions: { width: 118, flexDirection: 'column', alignItems: 'stretch', gap: 9 },
  headerActionButton: {
    width: 118,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: '#1B1B1B',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 8,
  },
  headerActionButtonYellow: {
    width: 118,
    minHeight: 50,
    borderRadius: 16,
    backgroundColor: '#FFD23F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D7B600',
    paddingHorizontal: 8,
  },
  headerActionText: { color: '#FFD23F', fontSize: 12, fontWeight: '900', textAlign: 'center' },
  headerActionTextDark: { color: '#111111', fontSize: 12, fontWeight: '900', textAlign: 'center' },
  optionsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end', paddingHorizontal: 14, paddingBottom: 14 },
  optionsSheet: {
    backgroundColor: '#F4F5F7',
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E4E4E4',
  },
  optionsTitle: { fontSize: 25, fontWeight: '900', color: '#111' },
  optionsSubtitle: { marginTop: 4, fontSize: 13, color: '#666', fontWeight: '700', lineHeight: 18 },
  optionsMenuButton: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  optionsMenuButtonTitle: { color: '#111', fontSize: 15, fontWeight: '900' },
  optionsMenuButtonSub: { marginTop: 4, color: '#666', fontSize: 12, fontWeight: '700', lineHeight: 17, maxWidth: 250 },
  optionsMenuChevron: { color: '#111', fontSize: 30, fontWeight: '400' },
  accountInfoCard: {
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  accountInfoTitle: { color: '#111', fontSize: 16, fontWeight: '900', marginBottom: 8 },
  accountInfoLine: { color: '#333', fontSize: 13, fontWeight: '800', marginTop: 6, lineHeight: 18 },
  settingsCreditCard: {
    marginTop: 14,
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  settingsCreditLabel: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '900',
  },
  settingsCreditValue: {
    color: '#111111',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  settingsCreditHelp: {
    color: '#777777',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 17,
  },
  ordersIconCard: {
    width: 108,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#242424',
    paddingHorizontal: 8,
  },
  ordersIconText: { color: '#FFD23F', fontSize: 12, fontWeight: '900', textAlign: 'center' },
  ordersIconBadge: {
    position: 'absolute',
    top: -7,
    right: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F4F5F7',
    color: "#FFD23F",
    fontWeight: "900",
  },

  ordersScreen: { flex: 1, backgroundColor: '#F4F5F7' },
  ordersContent: { padding: 18, paddingTop: 58, paddingBottom: 40 },
  ordersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  ordersSmall: {
    color: '#9C7A00',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  ordersTitle: { marginTop: 4, color: '#111', fontSize: 28, fontWeight: '900' },
  ordersSub: {
    marginTop: 5,
    color: '#666',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    maxWidth: 250,
  },
  ordersCloseButton: {
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  ordersCloseText: { color: '#FFD23F', fontSize: 13, fontWeight: '900' },
  refreshOrdersButton: {
    backgroundColor: '#FFD23F',
    borderRadius: 17,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  refreshOrdersButtonText: { color: '#111', fontSize: 14, fontWeight: '900' },
  ordersEmptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  ordersEmptyTitle: { color: '#111', fontSize: 20, fontWeight: '900' },
  ordersEmptyText: {
    marginTop: 8,
    color: '#666',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 20,
  },
  ordersList: { gap: 12 },
  customerOrderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  customerOrderCardCancelled: {
    borderColor: '#F2C2C2',
    backgroundColor: '#FFF8F8',
  },
  customerOrderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  customerOrderTitle: { color: '#111', fontSize: 17, fontWeight: '900' },
  customerOrderDate: { marginTop: 3, color: '#777', fontSize: 12, fontWeight: '700' },
  customerOrderStatusPill: {
    borderRadius: 999,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  orderStatusOut: { backgroundColor: '#FFF2B8' },
  orderStatusDelivered: { backgroundColor: '#DDF7E8' },
  orderStatusCancelled: { backgroundColor: '#FFDADA' },
  customerOrderStatusText: { color: '#111', fontSize: 11, fontWeight: '900' },
  customerOrderMeta: {
    marginTop: 12,
    color: '#333',
    fontSize: 14,
    fontWeight: '800',
  },
  cancelledOrderNotice: {
    marginTop: 12,
    backgroundColor: '#FFE6E6',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F2B8B8',
  },
  cancelledOrderNoticeTitle: {
    color: '#8B1717',
    fontSize: 13,
    fontWeight: '900',
    marginBottom: 4,
  },
  cancelledOrderNoticeText: {
    color: '#8B1717',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
  orderProgressPreview: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  orderProgressPreviewLabel: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderProgressPreviewText: {
    color: '#064E3B',
    fontSize: 14,
    fontWeight: '900',
    marginTop: 4,
    lineHeight: 20,
  },
  orderPinPreview: {
    marginTop: 12,
    backgroundColor: '#111',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
  },
  orderPinPreviewLabel: { color: '#FFD23F', fontSize: 11, fontWeight: '900' },
  orderPinPreviewNumber: {
    marginTop: 3,
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 4,
  },
  customerOrderTap: {
    marginTop: 12,
    color: '#9C7A00',
    fontSize: 12,
    fontWeight: '900',
  },
  detailProgressCard: {
    marginTop: 14,
    borderRadius: 22,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    padding: 16,
  },
  detailProgressTitle: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailProgressText: {
    color: '#064E3B',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
    lineHeight: 24,
  },
  detailPinCard: {
    backgroundColor: '#111',
    borderRadius: 26,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
  },
  detailPinLabel: { color: '#FFD23F', fontSize: 12, fontWeight: '900' },
  detailPinNumber: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 6,
  },
  detailPinWarning: {
    marginTop: 8,
    color: '#F7F7F7',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },
  orderDetailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    marginBottom: 14,
  },
  orderDetailSectionTitle: {
    color: '#111',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 12,
  },
  orderDetailItemRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  orderDetailItemName: { color: '#111', fontSize: 14, fontWeight: '900' },
  orderDetailItemMeta: { marginTop: 3, color: '#777', fontSize: 12, fontWeight: '700' },
  orderDetailItemTotal: { color: '#111', fontSize: 14, fontWeight: '900' },
  orderDetailSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
  },
  orderDetailSummaryLabel: { color: '#666', fontSize: 13, fontWeight: '800' },
  orderDetailSummaryValue: { color: '#111', fontSize: 13, fontWeight: '900' },
  orderDetailFreeDeliveryText: {
    marginTop: -2,
    marginBottom: 10,
    color: '#148A3B',
    fontSize: 12,
    fontWeight: '900',
  },
  orderDetailDeliveryEtaText: {
    marginTop: -3,
    marginBottom: 8,
    color: '#555',
    fontSize: 12,
    fontWeight: '800',
  },
  orderDetailSummaryTotal: { color: '#111', fontSize: 18, fontWeight: '900' },
  orderDetailPayment: { marginTop: 10, color: '#333', fontSize: 13, fontWeight: '900' },
  orderDetailText: { color: '#333', fontSize: 13, fontWeight: '700', lineHeight: 20 },

  orderStatusPreparing: { backgroundColor: '#EAF2FF' },
  preparingOrderNotice: {
    marginTop: 12,
    backgroundColor: '#EAF2FF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CFE0FF',
  },
  preparingOrderNoticeText: {
    color: '#174A8B',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
  detailPreparingCard: {
    backgroundColor: '#EAF2FF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CFE0FF',
    marginBottom: 14,
  },
  detailPreparingTitle: {
    color: '#174A8B',
    fontSize: 18,
    fontWeight: '900',
  },
  detailPreparingText: {
    marginTop: 6,
    color: '#174A8B',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
  },
  detailCancelledCard: {
    backgroundColor: '#FFE6E6',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2B8B8',
    marginBottom: 14,
  },
  detailCancelledTitle: {
    color: '#8B1717',
    fontSize: 18,
    fontWeight: '900',
  },
  detailCancelledText: {
    marginTop: 6,
    color: '#8B1717',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 20,
  },
  detailCancelledMeta: {
    marginTop: 8,
    color: '#8B1717',
    fontSize: 12,
    fontWeight: '700',
  },

  savedLocationsCard: {
    marginTop: 12,
    backgroundColor: '#F6F6F6',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    marginBottom: 12,
  },
  savedLocationsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  savedLocationsTitle: { color: '#111', fontSize: 15, fontWeight: '900' },
  savedLocationsSubtitle: {
    marginTop: 4,
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    maxWidth: 220,
  },
  savedLocationsRefreshButton: {
    backgroundColor: '#111',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  savedLocationsRefreshText: { color: '#FFD23F', fontSize: 11, fontWeight: '900' },
  savedLocationsEmptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  savedLocationsEmptyTitle: { color: '#111', fontSize: 13, fontWeight: '900' },
  savedLocationsEmptyText: {
    marginTop: 4,
    color: '#666',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
  },
  savedLocationsList: { gap: 9 },
  savedLocationButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 11,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  savedLocationIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFD23F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedLocationIconText: { color: '#111', fontSize: 18, fontWeight: '900' },
  savedLocationTextWrap: { flex: 1 },
  savedLocationName: { color: '#111', fontSize: 14, fontWeight: '900' },
  savedLocationCoords: {
    marginTop: 3,
    color: '#777',
    fontSize: 11,
    fontWeight: '700',
  },
  savedLocationUseText: { color: '#9C7A00', fontSize: 12, fontWeight: '900' },

  manualGpsTestBox: {
    marginTop: 12,
    backgroundColor: '#FFF8D8',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1D66B',
  },
  manualGpsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  manualGpsHeaderTextWrap: { flex: 1 },
  manualGpsTitle: { color: '#111', fontSize: 14, fontWeight: '900' },
  manualGpsSubtitle: {
    marginTop: 4,
    color: '#6B5A00',
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
  },
  manualGpsBadge: {
    backgroundColor: '#111',
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  manualGpsBadgeText: { color: '#FFD23F', fontSize: 10, fontWeight: '900' },
  manualGpsInputRow: { flexDirection: 'row', gap: 10 },
  manualGpsInputWrap: { flex: 1 },
  manualGpsInputLabel: { color: '#111', fontSize: 11, fontWeight: '900', marginBottom: 5 },
  manualGpsInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0C84F',
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: '#111',
    fontSize: 13,
    fontWeight: '800',
  },
  manualGpsApplyButton: {
    marginTop: 12,
    backgroundColor: '#111',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  manualGpsApplyButtonText: { color: '#FFD23F', fontSize: 13, fontWeight: '900' },

  saveLocationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 22,
  },
  saveLocationModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  saveLocationModalTitle: { color: '#111', fontSize: 24, fontWeight: '900' },
  saveLocationModalText: {
    marginTop: 7,
    color: '#666',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 10,
  },
  saveLocationPreviewBox: {
    marginTop: 12,
    backgroundColor: '#F6F6F6',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E2E2',
  },
  saveLocationPreviewText: { color: '#333', fontSize: 12, fontWeight: '800' },
  saveLocationConfirmButton: {
    marginTop: 16,
    backgroundColor: '#FFD23F',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveLocationConfirmButtonDisabled: { opacity: 0.55 },
  saveLocationConfirmText: { color: '#111', fontSize: 15, fontWeight: '900' },
  saveLocationCancelButton: {
    marginTop: 10,
    backgroundColor: '#111',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveLocationCancelText: { color: '#FFD23F', fontSize: 14, fontWeight: '900' },

  languageToggleDark: {
    backgroundColor: '#1B1B1B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#333333',
    minWidth: 64,
    minHeight: 48,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageToggleDarkText: {
    color: '#FFD23F',
    fontSize: 12,
    fontWeight: '900',
  },
  languageToggleLight: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 18,
    paddingVertical: 9,
    alignSelf: 'center',
  },
  languageToggleLightText: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '900',
  },


  checkoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  checkoutSectionTitle: {
    color: '#111111',
    fontSize: 17,
    fontWeight: '900',
  },
  checkoutHelpText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: '#111111',
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
  },
  locationButtonDisabled: {
    opacity: 0.6,
  },
  locationButtonText: {
    color: '#FFD23F',
    fontSize: 13,
    fontWeight: '900',
  },
  manualGpsBox: {
    backgroundColor: '#FFF8D8',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFD23F',
    padding: 12,
    marginTop: 14,
  },
  gpsInputRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  gpsInputBox: {
    flex: 1,
  },
  manualGpsButton: {
    backgroundColor: '#111111',
    borderRadius: 14,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 12,
  },
  manualGpsButtonText: {
    color: '#FFD23F',
    fontSize: 12,
    fontWeight: '900',
  },
  savedLocationsBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginTop: 14,
    marginBottom: 12,
  },
  savedLocationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  selectedLocationBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  selectedLocationText: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
});