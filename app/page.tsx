'use client';

import { createClient, Session, User } from '@supabase/supabase-js';
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import './globals.css';

const supabaseUrl = 'https://aarpjcfsnlasclxefdqj.supabase.co';
const supabaseAnonKey = 'sb_publishable_NWoe1kqAaGr4Oxpjb7Y_ng_lQ7MjZH4';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

const MAIN_SHOPPING_SCREEN_LOGO = '/darik_logo_final_v2.png';
const LOADING_SCREEN_LOGO = '/darik_logo_final_v3.png';


type Category = {
  id: string;
  name: string;
  description?: string | null;
};

type MarketplaceCategorySubcategory = {
  id: string;
  category_code: string | null;
  category_name_match?: string | null;
  item_type_code: string | null;
  department_code?: string | null;
  department_name_en?: string | null;
  department_name_ar?: string | null;
  item_type_name_en?: string | null;
  item_type_name_ar?: string | null;
  subcategory_name_en?: string | null;
  subcategory_name_ar?: string | null;
  sort_order?: number | string | null;
  is_active?: boolean | null;
};

type SubcategoryChip = {
  id: string;
  label: string;
  departmentCode?: string;
};

type Product = {
  id: string;
  retailer_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  vendor_price: number | string | null;
  app_price: number | string | null;
  quantity_in_stock: number | string | null;
  product_status: string | null;
  photo_status: string | null;
  official_product_photo_url: string | null;
  official_product_thumbnail_url?: string | null;
  retailer_raw_photo_url: string | null;
  product_free_delivery_enabled?: boolean | null;
  has_size_variants?: boolean | null;
  variant_summary?: string | null;
  subcategory_name?: string | null;
  clothing_department?: string | null;
  clothing_item_type?: string | null;
  category_name?: string | null;
  category_code?: string | null;
  size?: string | null;
  selected_size?: string | null;
  product_size?: string | null;
  variant_size?: string | null;
  size_label?: string | null;
  available_sizes?: string[] | string | null;
  sizes?: string[] | string | null;
  size_options?: string[] | string | null;
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
};

type CartItem = {
  id: string;
  productId: string;
  name: string;
  priceNumber: number;
  quantity: number;
  photoUrl?: string | null;
  selectedCartSize?: string | null;
  productVariantId?: string | null;
  variantSku?: string | null;
  variantWarehouseLocation?: string | null;
};

type SavedLocation = {
  id: string;
  label: string;
  latitude: string;
  longitude: string;
  addressDetails: string;
  deliveryNote?: string | null;
  createdAt: string;
};

type CustomerSettingsProfile = {
  fullName: string;
  phone: string;
  email: string;
  customerNumber: string;
  language: 'en' | 'ar';
};


type AppLanguage = 'en' | 'ar';

type SettingsTool = 'account' | 'orders' | 'support' | 'password' | 'locations';

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
  created_at?: string | null;
};

type CustomerOrder = {
  id: string;
  customer_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  order_number?: string | number | null;
  order_status: string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  delivery_option?: string | null;
  delivery_label?: string | null;
  delivery_eta_label?: string | null;
  driver_stops_away_label?: string | null;
  driver_stop_progress_stage?: string | null;
  subtotal: number | string | null;
  delivery_fee: number | string | null;
  total: number | string | null;
  customer_amount_due?: number | string | null;
  delivery_pin?: string | null;
  return_qualified?: boolean | null;
  return_not_qualified_reason?: string | null;
  delivery_address_details?: string | null;
  delivery_note?: string | null;
  created_at: string;
  delivered_at?: string | null;
  cancelled_at?: string | null;
};

type CustomerOrderItem = {
  id: string;
  order_id: string;
  product_id?: string | null;
  product_variant_id?: string | null;
  product_name: string | null;
  size_label_snapshot?: string | null;
  variant_sku_snapshot?: string | null;
  quantity: number | string | null;
  app_price: number | string | null;
  line_total: number | string | null;
  created_at?: string | null;
};

type DarikReturnRequest = {
  id: string;
  customer_id: string | null;
  order_id: string | null;
  order_item_id: string | null;
  product_id?: string | null;
  product_variant_id?: string | null;
  product_name?: string | null;
  resolution_type?: string | null;
  request_status?: string | null;
  pickup_task_status?: string | null;
  final_inspection_status?: string | null;
  replacement_status?: string | null;
  requested_at?: string | null;
  customer_note?: string | null;
  replacement_size_label?: string | null;
  net_credit_amount?: number | string | null;
  pickup_fee_deducted_from_credit?: number | string | null;
};

type PendingDarikReturnCheckout = {
  order: CustomerOrder;
  item: CustomerOrderItem;
  resolutionType: 'credit_return' | 'exact_replacement';
  unavailableReason?: string;
};

type SupportThread = {
  id: string;
  sender_type: string;
  sender_id: string | null;
  sender_name: string | null;
  sender_phone: string | null;
  sender_email: string | null;
  related_order_id: string | null;
  issue_type: string | null;
  subject: string | null;
  status: string | null;
  priority?: string | null;
  last_message_preview?: string | null;
  last_message_at?: string | null;
  created_at: string;
};

type SupportMessage = {
  id: string;
  thread_id: string;
  sender_role: string | null;
  sender_id: string | null;
  sender_name: string | null;
  message_body: string | null;
  attachment_url?: string | null;
  created_at: string;
};

const CUSTOMER_VISIBLE_ORDER_STATUSES = [
  'placed',
  'confirmed',
  'packing',
  'ready_for_driver',
  'out_for_delivery',
  'delivered',
  'cancelled',
  'cancelled_by_admin',
  'cancelled_by_customer',
  'archived',
];

const DARIK_RETURN_WINDOW_HOURS = 24;

const CUSTOMER_SUPPORT_ISSUE_TYPES = [
  'General question',
  'Order issue',
  'Delivery problem',
  'Return or exchange',
  'Product issue',
  'Account help',
];

const DARIK_WEB_TRANSLATIONS = {
  loading: { en: 'Loading', ar: 'جارٍ التحميل' },
  back: { en: 'Back', ar: 'رجوع' },
  settings: { en: 'Customer Settings', ar: 'إعدادات العميل' },
  menuSubtitle: { en: 'Quick access to your Darik account tools.', ar: 'وصول سريع لأدوات حسابك في Darik.' },
  saveSettings: { en: 'Save Settings', ar: 'حفظ الإعدادات' },
  accountInformation: { en: 'Account Information', ar: 'معلومات الحساب' },
  settingsSubtitle: { en: 'Your customer account details.', ar: 'تفاصيل حسابك كعميل.' },
  signedInAs: { en: 'Signed in as', ar: 'مسجّل الدخول باسم' },
  guestCustomer: { en: 'Guest customer', ar: 'عميل زائر' },
  loginRequired: { en: 'Login Required', ar: 'تسجيل الدخول مطلوب' },
  loginRequiredText: { en: 'Log in with the same Darik account you use in the customer app to see your real details, orders, support, and saved locations.', ar: 'سجّل دخولك بنفس حساب Darik المستخدم في تطبيق العميل حتى تظهر بياناتك وطلباتك والدعم والمواقع المحفوظة.' },
  login: { en: 'Login', ar: 'تسجيل الدخول' },
  signUp: { en: 'Sign Up', ar: 'إنشاء حساب' },
  customerLogin: { en: 'Customer Login', ar: 'دخول العميل' },
  createCustomerAccount: { en: 'Create Customer Account', ar: 'إنشاء حساب عميل' },
  email: { en: 'Email', ar: 'البريد الإلكتروني' },
  password: { en: 'Password', ar: 'كلمة المرور' },
  fullName: { en: 'Full Name', ar: 'الاسم الكامل' },
  phoneNumber: { en: 'Phone Number', ar: 'رقم الهاتف' },
  customerNumber: { en: 'Customer Number', ar: 'رقم العميل' },
  darikCreditBalance: { en: 'Darik Credit Balance', ar: 'رصيد Darik' },
  rememberPasswordNote: { en: 'Use the same password from the customer app.', ar: 'استخدم نفس كلمة المرور من تطبيق العميل.' },
  logout: { en: 'Logout', ar: 'تسجيل الخروج' },
  pleaseWait: { en: 'Please wait...', ar: 'يرجى الانتظار...' },
  otherOptions: { en: 'Other Options', ar: 'خيارات أخرى' },
  changeLanguage: { en: 'Change Language', ar: 'تغيير اللغة' },
  currentLanguage: { en: 'Current Language', ar: 'اللغة الحالية' },
  english: { en: 'English', ar: 'الإنجليزية' },
  arabic: { en: 'Arabic', ar: 'العربية' },
  seeOrderHistory: { en: 'See Order History', ar: 'عرض سجل الطلبات' },
  contactSupport: { en: 'Contact Support', ar: 'التواصل مع الدعم' },
  changeYourPassword: { en: 'Change Your Password', ar: 'تغيير كلمة المرور' },
  savedLocations: { en: 'Saved Delivery Locations', ar: 'مواقع التوصيل المحفوظة' },
  savedLocationsText: { en: 'Use, review, or remove saved addresses for future purchases.', ar: 'استخدم أو راجع أو احذف مواقعك المحفوظة للطلبات القادمة.' },
  noSavedLocationsYet: { en: 'No saved locations yet', ar: 'لا توجد مواقع محفوظة بعد' },
  noSavedLocationsText: { en: 'Save a location during checkout or use the customer app.', ar: 'احفظ موقعاً أثناء إتمام الطلب أو من تطبيق العميل.' },
  use: { en: 'Use', ar: 'استخدام' },
  remove: { en: 'Remove', ar: 'حذف' },
  orderHistory: { en: 'Order History', ar: 'سجل الطلبات' },
  refreshOrders: { en: 'Refresh Orders', ar: 'تحديث الطلبات' },
  noOrdersYet: { en: 'No orders yet', ar: 'لا توجد طلبات بعد' },
  orderItems: { en: 'Order Items', ar: 'منتجات الطلب' },
  delivery: { en: 'Delivery', ar: 'التوصيل' },
  subtotal: { en: 'Subtotal', ar: 'المجموع الفرعي' },
  total: { en: 'Total', ar: 'الإجمالي' },
  support: { en: 'Support Center', ar: 'مركز الدعم' },
  refreshSupport: { en: 'Refresh Support', ar: 'تحديث الدعم' },
  newSupportMessage: { en: 'New Support Message', ar: 'رسالة دعم جديدة' },
  issueType: { en: 'Issue Type', ar: 'نوع المشكلة' },
  subject: { en: 'Subject', ar: 'الموضوع' },
  message: { en: 'Message', ar: 'الرسالة' },
  sendMessage: { en: 'Send Message', ar: 'إرسال الرسالة' },
  mySupportTickets: { en: 'My Support Tickets', ar: 'تذاكر الدعم الخاصة بي' },
  noSupportTicketsYet: { en: 'No support tickets yet', ar: 'لا توجد تذاكر دعم بعد' },
  replySupportPlaceholder: { en: 'Reply to Darik support.', ar: 'اكتب رداً لدعم Darik.' },
  sendReply: { en: 'Send Reply', ar: 'إرسال الرد' },
  newPassword: { en: 'New Password', ar: 'كلمة المرور الجديدة' },
  confirmNewPassword: { en: 'Confirm New Password', ar: 'تأكيد كلمة المرور الجديدة' },
  passwordChangeHelp: { en: 'Use at least 6 characters. The same password works in the customer app and on getdarik.com.', ar: 'استخدم 6 أحرف على الأقل. نفس كلمة المرور تعمل في تطبيق العميل وعلى getdarik.com.' },
  updatePassword: { en: 'Update Password', ar: 'تحديث كلمة المرور' },
  updatingPassword: { en: 'Updating...', ar: 'جاري التحديث...' },
  passwordTooShort: { en: 'Password must be at least 6 characters.', ar: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل.' },
  passwordsDoNotMatch: { en: 'Passwords do not match.', ar: 'كلمتا المرور غير متطابقتين.' },
  passwordUpdated: { en: 'Password updated successfully.', ar: 'تم تحديث كلمة المرور بنجاح.' },
  settingsSaved: { en: 'Customer settings saved.', ar: 'تم حفظ إعدادات العميل.' },
  accountUpdated: { en: 'Account updated.', ar: 'تم تحديث الحساب.' },
  messageSent: { en: 'Darik support received your message.', ar: 'وصلت رسالتك إلى دعم Darik.' },
  replySent: { en: 'Reply sent.', ar: 'تم إرسال الرد.' },
  returnReplaceThisItem: { en: 'Return / Replace This Item', ar: 'إرجاع / استبدال هذا المنتج' },
  darikCreditReturn: { en: 'Darik Credit Return', ar: 'إرجاع كرصيد Darik' },
  exactReplacement: { en: 'Exact Replacement', ar: 'استبدال بنفس المنتج' },
  returnSubmitted: { en: 'Return request submitted.', ar: 'تم إرسال طلب الإرجاع.' },
  returnAlreadyRequested: { en: 'Return already requested for this item.', ar: 'تم طلب إرجاع لهذا المنتج مسبقاً.' },
  returnWindowClosed: { en: 'Return window closed.', ar: 'انتهت مدة الإرجاع.' },
  returnNoLongerQualified: { en: 'This product no longer qualifies for return because the return window has closed. Return window is 24 hours after delivery completed.', ar: 'هذا المنتج لم يعد مؤهلاً للإرجاع لأن فترة الإرجاع انتهت. فترة الإرجاع 24 ساعة بعد اكتمال التوصيل.' },
  deliveryCode: { en: 'Delivery Code', ar: 'رمز التوصيل' },
  giveCodeToDriver: { en: 'Give this code to the driver when the driver asks for it.', ar: 'أعطِ هذا الرمز للسائق عندما يطلبه.' },
  deliveredOrdersOnly: { en: 'Returns are available after delivery.', ar: 'الإرجاع متاح بعد التوصيل.' },
  returnStatus: { en: 'Return Status', ar: 'حالة الإرجاع' },
  creditReturnNote: { en: 'Darik reviews the request, picks up the item, then issues credit after inspection.', ar: 'تراجع Darik الطلب، تستلم المنتج، ثم تصدر الرصيد بعد الفحص.' },
  replacementReturnNote: { en: 'For defective items only. If approved, Darik sends the same item and collects the defective one.', ar: 'للمنتجات التالفة فقط. إذا تمت الموافقة، ترسل Darik نفس المنتج وتستلم المنتج التالف.' },
} as const;

type DarikWebTranslationKey = keyof typeof DARIK_WEB_TRANSLATIONS;

const DARIK_MARKUP_RATE = 0.25;
const DARIK_MARKUP_MULTIPLIER = 1 + DARIK_MARKUP_RATE;
const FREE_NEXT_DAY_MIN_ORDER = 10;
const DARIK_FULFILLMENT_FEE_RATE = 0.10;
const EXPRESS_DELIVERY_FEE = 2.50;
const EXPRESS_DRIVER_DELIVERY_FEE = 2.00;
const DARIK_WEB_CART_STORAGE_KEY = 'DarikWebCartStorageV1';
const DARIK_WEB_SAVE_FOR_LATER_STORAGE_KEY = 'DarikWebSaveForLaterStorageV1';
const DARIK_WEB_SAVED_LOCATIONS_STORAGE_KEY = 'DarikWebSavedLocationsV1';
const DARIK_WEB_CUSTOMER_SETTINGS_STORAGE_KEY = 'DarikWebCustomerSettingsV1';
const DARIK_WEB_CUSTOMER_LANGUAGE_KEY = 'DarikWebCustomerLanguageV1';
const DARIK_WEB_BOOT_TIMEOUT_MS = 3500;
const DARIK_WEB_AUTH_TIMEOUT_MS = 3500;


// L252 warehouse service radius settings.
// Replace these two coordinates with the exact Darik warehouse GPS when ready.
const DARIK_WAREHOUSE_LATITUDE = 31.953900;
const DARIK_WAREHOUSE_LONGITUDE = 35.910600;
const EXPRESS_DELIVERY_RADIUS_KM = 5;
const NEXT_DAY_DELIVERY_RADIUS_KM = 10;
const FEATURED_DEPARTMENTS_PER_LOAD = 2;
const FEATURED_PRODUCTS_PER_PAGE = 5;
const CATEGORY_PRODUCTS_PER_LOAD = 12;
const FEATURED_PRODUCTS_PREFETCH_PER_CATEGORY = 15;
const CATEGORY_PRODUCTS_PREFETCH_PER_CATEGORY = 48;



const fallbackCategories: Category[] = [
  { id: 'featured', name: 'Featured' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'baby', name: 'Baby & Kids' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'home', name: 'Home' },
  { id: 'auto', name: 'Auto' },
];

function money(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed.toFixed(2) : '0.00';
}

function roundMoney(value: number) {
  return Number(value.toFixed(2));
}

function roundUpToNearestFivePiasters(value: number) {
  const cents = Math.ceil((value * 100 - 0.000001) / 5) * 5;
  return roundMoney(cents / 100);
}

function getCustomerPriceFromRetailerPrice(retailerPrice: number | string | null | undefined) {
  return roundUpToNearestFivePiasters(Number(retailerPrice ?? 0) * DARIK_MARKUP_MULTIPLIER);
}

function getCustomerPrice(product: Product | null | undefined) {
  const appPrice = Number(product?.app_price ?? 0);
  if (Number.isFinite(appPrice) && appPrice > 0) return roundUpToNearestFivePiasters(appPrice);
  return getCustomerPriceFromRetailerPrice(product?.vendor_price ?? 0);
}

function getRetailerBasePrice(product: Product | null | undefined) {
  return roundMoney(Number(product?.vendor_price ?? 0));
}

function buildDeliveryEtaLabel(deliveryOption: '' | 'next_day_free' | 'express_2hr') {
  const now = new Date();
  const beforeCutoff = now.getHours() < 20;

  if (deliveryOption === 'express_2hr') {
    return beforeCutoff ? 'Delivered today under 2 hours' : 'After 8 PM cutoff — delivered tomorrow';
  }

  return beforeCutoff ? 'Delivered tomorrow' : 'After 8 PM cutoff — delivered day after tomorrow';
}

function degreesToRadians(value: number) {
  return (value * Math.PI) / 180;
}

function getDistanceKmBetweenCoordinates(
  fromLatitude: number,
  fromLongitude: number,
  toLatitude: number,
  toLongitude: number
) {
  const earthRadiusKm = 6371;
  const latitudeDelta = degreesToRadians(toLatitude - fromLatitude);
  const longitudeDelta = degreesToRadians(toLongitude - fromLongitude);
  const fromLatitudeRadians = degreesToRadians(fromLatitude);
  const toLatitudeRadians = degreesToRadians(toLatitude);

  const haversine =
    Math.sin(latitudeDelta / 2) * Math.sin(latitudeDelta / 2) +
    Math.cos(fromLatitudeRadians) *
      Math.cos(toLatitudeRadians) *
      Math.sin(longitudeDelta / 2) *
      Math.sin(longitudeDelta / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function getDistanceKmFromWarehouse(latitude: number, longitude: number) {
  return getDistanceKmBetweenCoordinates(
    DARIK_WAREHOUSE_LATITUDE,
    DARIK_WAREHOUSE_LONGITUDE,
    latitude,
    longitude
  );
}

function getDeliveryRadiusWarning(distanceKm: number | null, deliveryOption: '' | 'next_day_free' | 'express_2hr') {
  if (distanceKm === null) return '';

  if (deliveryOption === 'express_2hr' && distanceKm > EXPRESS_DELIVERY_RADIUS_KM) {
    return `Express Delivery is only available within ${EXPRESS_DELIVERY_RADIUS_KM} km from the Darik warehouse. This location is ${distanceKm.toFixed(1)} km away.`;
  }

  if (deliveryOption === 'next_day_free' && distanceKm > NEXT_DAY_DELIVERY_RADIUS_KM) {
    return `Free Next-Day Delivery is only available within ${NEXT_DAY_DELIVERY_RADIUS_KM} km from the Darik warehouse. This location is ${distanceKm.toFixed(1)} km away.`;
  }

  return '';
}

function shortCode(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 4)
    .toUpperCase();
}

function normalizeName(name: string | null | undefined) {
  return String(name ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCategoryEmoji(name: string | null | undefined) {
  const normalized = normalizeName(name);
  if (normalized.includes('cloth') || normalized.includes('fashion')) return '👕';
  if (normalized.includes('baby')) return '🍼';
  if (normalized.includes('cosmetic') || normalized.includes('beauty') || normalized.includes('makeup')) return '💄';
  if (normalized.includes('elect') || normalized.includes('tech') || normalized.includes('charger')) return '⚡';
  if (normalized.includes('gaming')) return '🎮';
  if (normalized.includes('home')) return '🛋️';
  if (normalized.includes('auto') || normalized.includes('car')) return '🚘';
  if (normalized.includes('pet')) return '🐾';
  if (normalized.includes('office')) return '🗂️';
  if (normalized.includes('tool')) return '🛠️';
  return '•••';
}

function getCategoryPreviewImageUrl(name: string | null | undefined) {
  const normalized = normalizeName(name);

  if (normalized.includes('auto') || normalized.includes('car')) {
    return '/category_auto_emergency.png';
  }

  if (normalized.includes('electrical') || normalized.includes('electronic') || normalized.includes('charger')) {
    return '/category_electrical_essentials.png';
  }

  if (normalized.includes('gaming')) {
    return '/category_gaming_accessories.png';
  }

  if (normalized.includes('network')) {
    return '/category_networking.png';
  }

  if (normalized.includes('office') || normalized.includes('school')) {
    return '/category_office_supplies.png';
  }

  if (normalized.includes('tech') || normalized.includes('accessor')) {
    return '/category_tech_accessories.png';
  }

  if (normalized.includes('tool') || normalized.includes('hardware')) {
    return '/category_tools_hardware.png';
  }

  if (normalized.includes('cloth') || normalized.includes('fashion')) {
    return '/category_clothing.png';
  }

  if (normalized.includes('home') || normalized.includes('house')) {
    return '/category_home_goods.png';
  }

  if (normalized.includes('garden')) {
    return '/category_gardening.png';
  }

  if (normalized.includes('toy')) {
    return '/category_toys.png';
  }

  if (normalized.includes('baby') || normalized.includes('kid')) {
    return '/category_baby.png';
  }

  if (
    normalized.includes('cosmetic') ||
    normalized.includes('beauty') ||
    normalized.includes('makeup') ||
    normalized.includes('skin') ||
    normalized.includes('hair')
  ) {
    return '/category_cosmetics.png';
  }

  if (normalized.includes('pet')) {
    return '/category_pets.png';
  }

  return null;
}

function getDarikCategorySortRank(categoryName: string | null | undefined) {
  const normalized = normalizeName(categoryName);

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
    normalized === 'car emergencies' ||
    normalized.includes('auto emergency') ||
    normalized.includes('car emergency')
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


function normalizeMarketplaceCode(value: string | null | undefined) {
  return normalizeName(value).replace(/\s+/g, '_');
}

function normalizeMarketplaceCategoryCode(value: string | null | undefined) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function normalizeLoose(value: string | null | undefined) {
  return normalizeName(value)
    .replace(/[_\-\/]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getDefaultSubcategoryCategoryCode(categoryName: string | null | undefined) {
  const cleanName = normalizeLoose(categoryName);

  if (
    cleanName.includes('baby') ||
    cleanName.includes('kids') ||
    cleanName.includes('children') ||
    cleanName.includes('بيبي') ||
    cleanName.includes('أطفال') ||
    cleanName.includes('اطفال')
  ) {
    return 'baby';
  }

  if (
    cleanName.includes('cosmetic') ||
    cleanName.includes('makeup') ||
    cleanName.includes('beauty') ||
    cleanName.includes('skin care') ||
    cleanName.includes('skincare') ||
    cleanName.includes('personal care') ||
    cleanName.includes('تجميل') ||
    cleanName.includes('مكياج') ||
    cleanName.includes('ميك اب') ||
    cleanName.includes('عناية') ||
    cleanName.includes('كوزمتك')
  ) {
    return 'cosmetics';
  }

  return normalizeMarketplaceCode(categoryName);
}

function stripSubcategoryLeaf(value: string | null | undefined) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  if (text.includes('>')) return text.split('>').pop()?.trim() || text;
  if (text.includes('•')) return text.split('•').pop()?.trim() || text;
  return text;
}

function productMatchesMainCategory(product: Product, selectedCategoryId: string, selectedCategoryName: string, selectedCategoryCode: string) {
  if (selectedCategoryId === 'BestSellers' || selectedCategoryId === 'All') return true;

  const productCategoryId = String(product.category_id ?? '').trim();
  const selectedId = String(selectedCategoryId ?? '').trim();

  if (productCategoryId && selectedId && productCategoryId === selectedId) {
    return true;
  }

  const productCategoryCode = normalizeMarketplaceCategoryCode(product.category_code || product.category_name || '');
  const productCategoryName = normalizeMarketplaceCategoryCode(product.category_name || '');
  const selectedNameCode = normalizeMarketplaceCategoryCode(selectedCategoryName);
  const selectedCode = normalizeMarketplaceCategoryCode(selectedCategoryCode);

  if (productCategoryCode && (productCategoryCode === selectedCode || productCategoryCode === selectedNameCode)) {
    return true;
  }

  if (productCategoryName && (productCategoryName === selectedCode || productCategoryName === selectedNameCode)) {
    return true;
  }

  // Some products only carry department/category in clothing_department for Supabase-driven category systems.
  const productDepartment = normalizeMarketplaceCategoryCode(product.clothing_department);
  if (productDepartment && (productDepartment === selectedCode || productDepartment === selectedNameCode)) {
    return true;
  }

  return false;
}

function productMatchesSubcategory(product: Product, selectedDepartmentCode: string, selectedItemTypeCode: string, rows: MarketplaceCategorySubcategory[]) {
  // Match the Customer App logic:
  // selectedDepartmentCode is compared against products.clothing_department.
  // selectedItemTypeCode is compared against products.clothing_item_type.
  // Do not fuzzy-match names/descriptions, because that creates inaccurate filters.
  if (selectedDepartmentCode === 'All' && selectedItemTypeCode === 'All') return true;

  const productDepartmentCode = normalizeMarketplaceCategoryCode(product.clothing_department);
  const productItemTypeCode = normalizeMarketplaceCategoryCode(product.clothing_item_type);

  if (selectedDepartmentCode !== 'All' && productDepartmentCode !== normalizeMarketplaceCategoryCode(selectedDepartmentCode)) {
    return false;
  }

  if (selectedItemTypeCode !== 'All' && productItemTypeCode !== normalizeMarketplaceCategoryCode(selectedItemTypeCode)) {
    return false;
  }

  return true;
}

function parseSizeList(value: string[] | string | null | undefined) {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value.map((size) => String(size).trim()).filter(Boolean);
  }

  const cleanValue = String(value).trim();
  if (!cleanValue) return [];

  try {
    const parsed = JSON.parse(cleanValue);
    if (Array.isArray(parsed)) {
      return parsed.map((size) => String(size).trim()).filter(Boolean);
    }
  } catch {
    // keep parsing comma/pipe text below
  }

  return cleanValue
    .split(/[,|/]+/g)
    .map((size) => size.trim())
    .filter(Boolean);
}

function getProductSingleSize(product: Product | null | undefined) {
  if (!product) return '';

  return (
    product.size ||
    product.selected_size ||
    product.product_size ||
    product.variant_size ||
    product.size_label ||
    ''
  ).trim();
}

function getProductSizeOptions(product: Product | null | undefined, variants: ProductVariant[] = []) {
  if (!product) return [];

  const variantSizes = variants
    .filter((variant) => Number(variant.quantity_in_stock ?? 0) > 0)
    .map((variant) => String(variant.size_label ?? '').trim())
    .filter(Boolean);

  const explicitSizes = [
    ...parseSizeList(product.available_sizes),
    ...parseSizeList(product.sizes),
    ...parseSizeList(product.size_options),
  ];

  const singleSize = getProductSingleSize(product);

  return Array.from(
    new Set([...variantSizes, ...explicitSizes, singleSize].map((size) => size.trim()).filter(Boolean))
  );
}

function isActiveSellableVariant(variant: ProductVariant) {
  const status = String(variant.variant_status ?? 'active').toLowerCase();
  return status !== 'archived' && status !== 'deleted' && status !== 'inactive' && Number(variant.quantity_in_stock ?? 0) > 0;
}

function sortProductVariants(variants: ProductVariant[]) {
  return [...variants].sort((left, right) => {
    const leftOrder = Number(left.size_sort_order ?? 9999);
    const rightOrder = Number(right.size_sort_order ?? 9999);

    if (Number.isFinite(leftOrder) && Number.isFinite(rightOrder) && leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return String(left.size_label ?? '').localeCompare(String(right.size_label ?? ''));
  });
}

function productRequiresSize(product: Product | null | undefined, categoryById: Map<string, Category>) {
  if (!product) return false;

  const categoryName = product.category_id ? categoryById.get(product.category_id)?.name ?? '' : '';
  const categoryCode = normalizeLoose(product.category_code || categoryName);
  const departmentCode = normalizeLoose(product.clothing_department);
  const subcategoryName = normalizeLoose(product.subcategory_name);

  return (
    product.has_size_variants === true ||
    categoryCode.includes('clothing') ||
    departmentCode.includes('mens') ||
    departmentCode.includes('women') ||
    departmentCode.includes('boys') ||
    departmentCode.includes('girls') ||
    subcategoryName.includes('clothing')
  );
}

function getCartItemSizeKey(size: string | null | undefined) {
  const clean = String(size ?? '').trim();
  return clean || 'NO_SIZE';
}

function getCartItemLabel(product: Product, size: string | null | undefined) {
  const cleanSize = String(size ?? '').trim();
  return cleanSize ? `${product.name} - Size ${cleanSize}` : product.name;
}

function normalizeStoredCartItems(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const rawItem = item as Partial<CartItem>;
      const id = String(rawItem.id ?? '').trim();
      const productId = String(rawItem.productId ?? '').trim();
      const name = String(rawItem.name ?? '').trim();
      const priceNumber = Number(rawItem.priceNumber ?? 0);
      const quantity = Number(rawItem.quantity ?? 0);

      if (!id || !productId || !name || !Number.isFinite(priceNumber) || priceNumber <= 0 || !Number.isFinite(quantity) || quantity <= 0) {
        return null;
      }

      return {
        id,
        productId,
        name,
        priceNumber,
        quantity: Math.floor(quantity),
        photoUrl: rawItem.photoUrl ?? null,
        selectedCartSize: rawItem.selectedCartSize ?? null,
        productVariantId: rawItem.productVariantId ?? null,
        variantSku: rawItem.variantSku ?? null,
        variantWarehouseLocation: rawItem.variantWarehouseLocation ?? null,
      } as CartItem;
    })
    .filter(Boolean) as CartItem[];
}

function normalizeStoredLocations(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const rawItem = item as Partial<SavedLocation>;
      const id = String(rawItem.id ?? '').trim();
      const label = String(rawItem.label ?? '').trim();
      const latitude = String(rawItem.latitude ?? '').trim();
      const longitude = String(rawItem.longitude ?? '').trim();
      const addressDetails = String(rawItem.addressDetails ?? '').trim();

      if (!id || !label || !latitude || !longitude) {
        return null;
      }

      return {
        id,
        label,
        latitude,
        longitude,
        addressDetails,
        deliveryNote: rawItem.deliveryNote ?? null,
        createdAt: String(rawItem.createdAt ?? new Date().toISOString()),
      } as SavedLocation;
    })
    .filter(Boolean) as SavedLocation[];
}

function normalizeStoredCustomerSettings(value: unknown): CustomerSettingsProfile {
  const rawValue = (value ?? {}) as Partial<CustomerSettingsProfile>;
  const language = rawValue.language === 'ar' ? 'ar' : 'en';

  return {
    fullName: String(rawValue.fullName ?? '').trim(),
    phone: String(rawValue.phone ?? '').trim(),
    email: String(rawValue.email ?? '').trim(),
    customerNumber: String(rawValue.customerNumber ?? '').trim(),
    language,
  };
}

function getProductPhotoUrl(product: Product | null | undefined) {
  if (!product) return null;
  return (
    product.official_product_thumbnail_url ||
    product.official_product_photo_url ||
    product.retailer_raw_photo_url ||
    null
  );
}

function darikTimeout(ms: number) {
  return new Promise<null>((resolve) => {
    window.setTimeout(() => resolve(null), ms);
  });
}

function safeReadDarikJson<T>(storageKey: string, fallbackValue: T): T {
  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) return fallbackValue;
    return JSON.parse(rawValue) as T;
  } catch {
    window.localStorage.removeItem(storageKey);
    return fallbackValue;
  }
}

export default function DarikCustomerWebHome() {
  const [loading, setLoading] = useState(true);
  const [catalogDeferredLoading, setCatalogDeferredLoading] = useState(false);
  const [catalogLoaded, setCatalogLoaded] = useState(false);
  const catalogLoadStartedRef = useRef(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [marketplaceCategorySubcategories, setMarketplaceCategorySubcategories] = useState<MarketplaceCategorySubcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [banners, setBanners] = useState<CustomerAdBanner[]>([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [headerShrunk, setHeaderShrunk] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('BestSellers');
  const [selectedDepartmentCode, setSelectedDepartmentCode] = useState('All');
  const [selectedSubcategoryCode, setSelectedSubcategoryCode] = useState('All');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedForLaterItems, setSavedForLaterItems] = useState<CartItem[]>([]);
  const [cartStorageReady, setCartStorageReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlacedOpen, setOrderPlacedOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [placedOrderPin, setPlacedOrderPin] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerNumber, setCustomerNumber] = useState('');
  const [customerLanguage, setCustomerLanguage] = useState<'en' | 'ar'>('en');
  const [deliveryAddressDetails, setDeliveryAddressDetails] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [manualLatitude, setManualLatitude] = useState('');
  const [manualLongitude, setManualLongitude] = useState('');
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [selectedSavedLocationId, setSelectedSavedLocationId] = useState('');
  const [saveLocationForFuture, setSaveLocationForFuture] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<'' | 'next_day_free' | 'express_2hr'>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productImageZoomOpen, setProductImageZoomOpen] = useState(false);
  const [selectedClothingSize, setSelectedClothingSize] = useState('');
  const [selectedClothingVariantId, setSelectedClothingVariantId] = useState('');
  const [visibleFeaturedDepartmentCount, setVisibleFeaturedDepartmentCount] = useState(FEATURED_DEPARTMENTS_PER_LOAD);
  const [featuredProductPageByDepartment, setFeaturedProductPageByDepartment] = useState<Record<string, number>>({});
  const lastFeaturedBatchLoadScrollYRef = useRef(0);
  const [visibleCategoryProductCount, setVisibleCategoryProductCount] = useState(CATEGORY_PRODUCTS_PER_LOAD);
  const lastCategoryBatchLoadScrollYRef = useRef(0);
  const loadedProductCategoryLimitRef = useRef<Record<string, number>>({});
  const loadingProductCategoryRef = useRef<Record<string, boolean>>({});
  const shoppingReturnStateRef = useRef<{
    scrollY: number;
    categoryId: string;
    departmentCode: string;
    subcategoryCode: string;
    searchText: string;
  } | null>(null);

  const [authLoading, setAuthLoading] = useState(true);
  const [authBusy, setAuthBusy] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [customerSession, setCustomerSession] = useState<Session | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [customerOrderItems, setCustomerOrderItems] = useState<CustomerOrderItem[]>([]);
  const [darikReturnRequests, setDarikReturnRequests] = useState<DarikReturnRequest[]>([]);
  const [returnRequestBusyItemId, setReturnRequestBusyItemId] = useState('');
  const [pendingReturnCheckout, setPendingReturnCheckout] = useState<PendingDarikReturnCheckout | null>(null);
  const [returnCheckoutReason, setReturnCheckoutReason] = useState('');
  const [expandedPastOrderIds, setExpandedPastOrderIds] = useState<Record<string, boolean>>({});
  const [settingsActiveTool, setSettingsActiveTool] = useState<SettingsTool>('account');
  const [settingsError, setSettingsError] = useState('');
  const [supportThreads, setSupportThreads] = useState<SupportThread[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [supportBusy, setSupportBusy] = useState(false);
  const [supportIssueType, setSupportIssueType] = useState(CUSTOMER_SUPPORT_ISSUE_TYPES[0]);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessageBody, setSupportMessageBody] = useState('');
  const [supportReplyBody, setSupportReplyBody] = useState('');
  const [supportRelatedOrderId, setSupportRelatedOrderId] = useState<string | null>(null);
  const [selectedSupportThreadId, setSelectedSupportThreadId] = useState<string | null>(null);
  const [newCustomerPassword, setNewCustomerPassword] = useState('');
  const [confirmCustomerPassword, setConfirmCustomerPassword] = useState('');
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [settingsHighlightedTool, setSettingsHighlightedTool] = useState<SettingsTool | null>(null);
  const settingsSectionRefs = useRef<Record<SettingsTool, HTMLElement | null>>({
    account: null,
    orders: null,
    support: null,
    password: null,
    locations: null,
  });



  function t(key: DarikWebTranslationKey) {
    return DARIK_WEB_TRANSLATIONS[key]?.[customerLanguage] ?? DARIK_WEB_TRANSLATIONS[key]?.en ?? key;
  }

  useEffect(() => {
    const faviconHref = MAIN_SHOPPING_SCREEN_LOGO;

    let iconLink = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!iconLink) {
      iconLink = document.createElement('link');
      iconLink.rel = 'icon';
      document.head.appendChild(iconLink);
    }
    iconLink.type = 'image/png';
    iconLink.href = faviconHref;

    let shortcutIconLink = document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]');
    if (!shortcutIconLink) {
      shortcutIconLink = document.createElement('link');
      shortcutIconLink.rel = 'shortcut icon';
      document.head.appendChild(shortcutIconLink);
    }
    shortcutIconLink.type = 'image/png';
    shortcutIconLink.href = faviconHref;

    let appleTouchIconLink = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
    if (!appleTouchIconLink) {
      appleTouchIconLink = document.createElement('link');
      appleTouchIconLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleTouchIconLink);
    }
    appleTouchIconLink.href = faviconHref;
  }, []);

  function showSettingsMessage(message: string) {
    setSettingsSavedMessage(message);
    window.setTimeout(() => setSettingsSavedMessage(''), 2600);
  }

  function showSettingsError(message: string) {
    setSettingsError(message);
    window.setTimeout(() => setSettingsError(''), 5200);
  }

  function scrollSettingsToolIntoView(tool: SettingsTool) {
    setSettingsHighlightedTool(tool);

    window.setTimeout(() => {
      const target = settingsSectionRefs.current[tool];
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);

    window.setTimeout(() => {
      setSettingsHighlightedTool((currentTool) => (currentTool === tool ? null : currentTool));
    }, 1800);
  }

  function openSettingsTool(tool: SettingsTool) {
    setSettingsActiveTool(tool);
    scrollSettingsToolIntoView(tool);
  }

  function getHighlightedSettingsClass(tool: SettingsTool) {
    return settingsHighlightedTool === tool ? ' settingsPanelFocusPulse' : '';
  }

  function getOrderDisplayNumber(order: CustomerOrder) {
    const explicitNumber = String(order.order_number ?? '').trim();
    return explicitNumber || order.id.slice(0, 8).toUpperCase();
  }

  function formatDisplayDate(value: string | null | undefined) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString(customerLanguage === 'ar' ? 'ar-JO' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getItemsForOrder(orderId: string) {
    return customerOrderItems.filter((item) => item.order_id === orderId);
  }

  function getReturnRequestForItem(orderId: string, itemId: string) {
    return darikReturnRequests.find((request) => request.order_id === orderId && request.order_item_id === itemId) ?? null;
  }

  function getReturnWindowBaseTime(order: CustomerOrder) {
    return order.delivered_at || order.created_at;
  }

  function isOrderDeliveredForReturn(order: CustomerOrder) {
    const status = String(order.order_status ?? '').toLowerCase();
    return status === 'delivered';
  }

  function isReturnWindowOpen(order: CustomerOrder) {
    if (order.return_qualified === false) return false;
    if (!isOrderDeliveredForReturn(order)) return false;
    const baseTime = getReturnWindowBaseTime(order);
    if (!baseTime) return false;
    const startedAt = new Date(baseTime).getTime();
    if (Number.isNaN(startedAt)) return false;
    return Date.now() - startedAt <= DARIK_RETURN_WINDOW_HOURS * 60 * 60 * 1000;
  }

  function getReturnStatusLabel(request: DarikReturnRequest | null) {
    if (!request) return '';
    const resolution = String(request.resolution_type ?? '').replace(/_/g, ' ');
    const requestStatus = String(request.request_status ?? 'requested').replace(/_/g, ' ');
    const pickupStatus = request.pickup_task_status ? ` • Pickup: ${String(request.pickup_task_status).replace(/_/g, ' ')}` : '';
    const replacementStatus = request.replacement_status ? ` • Replacement: ${String(request.replacement_status).replace(/_/g, ' ')}` : '';
    return `${resolution || 'return'} • ${requestStatus}${pickupStatus}${replacementStatus}`;
  }

  function getReturnUnavailableReason(order: CustomerOrder) {
    if (order.return_qualified === false) {
      return order.return_not_qualified_reason || t('returnNoLongerQualified');
    }

    if (!isOrderDeliveredForReturn(order)) return t('deliveredOrdersOnly');
    if (!isReturnWindowOpen(order)) return t('returnWindowClosed');

    return '';
  }

  function hasDeliveryCodeForDriver(order: CustomerOrder) {
    const pin = String(order.delivery_pin ?? '').trim();
    const status = String(order.order_status ?? '').toLowerCase();
    return Boolean(pin) && !['delivered', 'cancelled', 'canceled'].includes(status);
  }

  function isPastOrderExpanded(orderId: string) {
    return Boolean(expandedPastOrderIds[orderId]);
  }

  function togglePastOrderDetails(orderId: string) {
    setExpandedPastOrderIds((current) => ({
      ...current,
      [orderId]: !current[orderId],
    }));
  }

  function getOrderItemPhotoUrl(item: CustomerOrderItem) {
    const rawItem = item as any;
    return String(
      rawItem.product_photo_url ||
        rawItem.product_image_url ||
        rawItem.official_photo_url ||
        rawItem.image_url ||
        rawItem.photo_url ||
        rawItem.main_photo_url ||
        '',
    ).trim();
  }

  function openDarikReturnCheckout(
    order: CustomerOrder,
    item: CustomerOrderItem,
    resolutionType: 'credit_return' | 'exact_replacement',
  ) {
    if (!customerProfile) {
      showSettingsError(t('loginRequiredText'));
      return;
    }

    const existingRequest = getReturnRequestForItem(order.id, item.id);
    if (existingRequest && !['cancelled', 'denied', 'rejected'].includes(String(existingRequest.request_status ?? '').toLowerCase())) {
      showSettingsError(t('returnAlreadyRequested'));
      return;
    }

    // L357:
    // Always open the return checkout screen when the customer taps Return/Replace.
    // If the item is not eligible, the checkout screen shows the reason instead of the tap feeling dead.
    const unavailableReason = getReturnUnavailableReason(order);

    setPendingReturnCheckout({ order, item, resolutionType, unavailableReason });
    setReturnCheckoutReason('');
  }

  function closeDarikReturnCheckout() {
    if (returnRequestBusyItemId) return;
    setPendingReturnCheckout(null);
    setReturnCheckoutReason('');
  }

  async function submitDarikReturnRequestFromCheckout() {
    if (!customerProfile || !pendingReturnCheckout) {
      showSettingsError(t('loginRequiredText'));
      return;
    }

    const { order, item, resolutionType } = pendingReturnCheckout;

    if (!isReturnWindowOpen(order)) {
      showSettingsError(getReturnUnavailableReason(order) || t('returnWindowClosed'));
      return;
    }

    const existingRequest = getReturnRequestForItem(order.id, item.id);
    if (existingRequest && !['cancelled', 'denied', 'rejected'].includes(String(existingRequest.request_status ?? '').toLowerCase())) {
      showSettingsError(t('returnAlreadyRequested'));
      closeDarikReturnCheckout();
      return;
    }

    const cleanReason = returnCheckoutReason.trim();
    if (cleanReason.length < 8) {
      showSettingsError('Please explain why you want to return this item.');
      return;
    }

    const isReplacement = resolutionType === 'exact_replacement';
    const replacementSizeText = item.size_label_snapshot ? ` Replacement size requested: ${item.size_label_snapshot}.` : '';
    const reasonCategory = isReplacement ? 'Defective item - wants exact replacement' : 'Customer requested Darik Credit return';
    const customerNote = isReplacement
      ? `Customer chose free exact same item replacement from getdarik.com return checkout. Reason: ${cleanReason}.${replacementSizeText}`
      : `Customer chose Darik Credit return from getdarik.com return checkout. Reason: ${cleanReason}`;

    setReturnRequestBusyItemId(item.id);

    const { data, error } = await supabase.rpc('customer_request_darik_return_v3', {
      p_customer_id: customerProfile.id,
      p_order_id: order.id,
      p_order_item_id: item.id,
      p_resolution_type: resolutionType,
      p_reason_category: reasonCategory,
      p_customer_note: customerNote,
      p_customer_photo_url: null,
      p_replacement_product_variant_id: isReplacement ? item.product_variant_id ?? null : null,
      p_replacement_size_label: isReplacement ? item.size_label_snapshot ?? null : null,
    });

    setReturnRequestBusyItemId('');

    if (error) {
      showSettingsError(error.message);
      return;
    }

    const result = Array.isArray(data) ? data[0] : data;
    if (result?.success === false) {
      showSettingsError(result.message || 'Could not submit return request.');
      return;
    }

    setPendingReturnCheckout(null);
    setReturnCheckoutReason('');
    showSettingsMessage(result?.message || t('returnSubmitted'));
    await loadCustomerOrders(customerProfile.id);
  }


  function getMessagesForSupportThread(threadId: string) {
    return supportMessages
      .filter((message) => message.thread_id === threadId)
      .sort((left, right) => new Date(left.created_at).getTime() - new Date(right.created_at).getTime());
  }

  function normalizeDbSavedLocation(row: any): SavedLocation {
    return {
      id: String(row.id ?? ''),
      label: String(row.label ?? 'Saved Location'),
      latitude: String(row.latitude ?? ''),
      longitude: String(row.longitude ?? ''),
      addressDetails: String(row.address_details ?? row.addressDetails ?? ''),
      deliveryNote: row.delivery_note ?? row.deliveryNote ?? null,
      createdAt: String(row.created_at ?? row.createdAt ?? new Date().toISOString()),
    };
  }

  function syncCustomerProfileToFields(profile: CustomerProfile | null, user?: User | null) {
    setCustomerProfile(profile);

    if (!profile) {
      setCustomerNumber('');
      return;
    }

    setCustomerName(profile.full_name ?? '');
    setCustomerPhone(profile.phone ?? '');
    setCustomerEmail(profile.email ?? user?.email ?? '');
    setCustomerNumber(profile.customer_number ?? '');
  }

  async function loadCustomerOrders(profileId?: string | null) {
    if (!profileId) {
      setCustomerOrders([]);
      setCustomerOrderItems([]);
      setDarikReturnRequests([]);
      return;
    }

    const ordersResult = await supabase
      .from('orders')
      .select('*')
      .eq('customer_id', profileId)
      .in('order_status', CUSTOMER_VISIBLE_ORDER_STATUSES)
      .order('created_at', { ascending: false });

    if (ordersResult.error) {
      showSettingsError(ordersResult.error.message);
      return;
    }

    let loadedOrders = (ordersResult.data ?? []) as CustomerOrder[];

    try {
      const { data: statusRows, error: statusError } = await supabase.rpc('customer_get_order_return_pin_status_v1', {
        p_customer_id: profileId,
      });

      if (!statusError && Array.isArray(statusRows)) {
        const statusByOrderId = new Map(
          statusRows.map((row: any) => [
            String(row.order_id ?? ''),
            {
              delivery_pin: row.delivery_pin ?? null,
              return_qualified: row.return_qualified,
              return_not_qualified_reason: row.return_not_qualified_reason ?? null,
            },
          ]),
        );

        loadedOrders = loadedOrders.map((order) => {
          const status = statusByOrderId.get(order.id);
          if (!status) return order;

          return {
            ...order,
            delivery_pin: status.delivery_pin || order.delivery_pin || null,
            return_qualified: typeof status.return_qualified === 'boolean' ? status.return_qualified : order.return_qualified ?? null,
            return_not_qualified_reason: status.return_not_qualified_reason || order.return_not_qualified_reason || null,
          };
        });
      }
    } catch {
      // The order page should still load even if the helper RPC is not installed yet.
    }

    setCustomerOrders(loadedOrders);

    const orderIds = loadedOrders.map((order) => order.id);
    if (orderIds.length === 0) {
      setCustomerOrderItems([]);
      setDarikReturnRequests([]);
      return;
    }

    const itemsResult = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds)
      .order('created_at', { ascending: true });

    if (itemsResult.error) {
      showSettingsError(itemsResult.error.message);
      return;
    }

    setCustomerOrderItems((itemsResult.data ?? []) as CustomerOrderItem[]);

    const returnsResult = await supabase
      .from('darik_return_requests')
      .select('*')
      .in('order_id', orderIds)
      .order('requested_at', { ascending: false });

    if (!returnsResult.error) {
      setDarikReturnRequests((returnsResult.data ?? []) as DarikReturnRequest[]);
    }
  }

  async function loadCustomerSavedLocations(profileId?: string | null) {
    if (!profileId) {
      return;
    }

    const savedLocationsResult = await supabase
      .from('customer_saved_locations')
      .select('*')
      .eq('customer_id', profileId)
      .order('created_at', { ascending: false });

    if (savedLocationsResult.error) {
      // Keep local saved locations available if the table/RLS is not ready.
      return;
    }

    setSavedLocations((savedLocationsResult.data ?? []).map(normalizeDbSavedLocation).slice(0, 20));
  }



  function isSupportThreadClosedForCustomer(thread: SupportThread | null | undefined) {
    const status = String((thread as any)?.status ?? '').trim().toLowerCase();
    return [
      'closed',
      'resolved',
      'complete',
      'completed',
      'done',
      'archived',
      'cancelled',
      'canceled',
    ].includes(status);
  }

  function getSupportThreadClosedLabel(thread: SupportThread | null | undefined) {
    const status = String((thread as any)?.status ?? '').trim().toLowerCase();
    if (status === 'resolved' || status === 'complete' || status === 'completed' || status === 'done') {
      return 'This chat has been resolved. You can still view the full conversation, but you cannot send new messages here.';
    }
    return 'This chat is closed. You can still view the full conversation, but you cannot send new messages here.';
  }


  function normalizeSupportMessageForCustomerWeb(rawMessage: any): SupportMessage {
    const messageBody =
      rawMessage?.message_body ??
      rawMessage?.body ??
      rawMessage?.message ??
      rawMessage?.message_text ??
      rawMessage?.content ??
      '';

    return {
      ...rawMessage,
      message_body: String(messageBody ?? ''),
      sender_role: rawMessage?.sender_role ?? rawMessage?.sender_type ?? rawMessage?.role ?? 'admin',
      sender_name: rawMessage?.sender_name ?? rawMessage?.admin_name ?? rawMessage?.staff_name ?? 'Darik Support',
    } as SupportMessage;
  }

  function normalizeSupportThreadForCustomerWeb(rawThread: any): SupportThread {
    return {
      ...rawThread,
      last_message_preview:
        rawThread?.last_message_preview ??
        rawThread?.last_message ??
        rawThread?.latest_message_preview ??
        rawThread?.subject ??
        '',
    } as SupportThread;
  }


  async function loadCustomerSupport(profileId?: string | null) {
    if (!profileId) {
      setSupportThreads([]);
      setSupportMessages([]);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('customer_get_support_threads_with_messages_v3', {
        p_customer_id: profileId,
      });

      if (!error) {
        const payload = Array.isArray(data) ? data[0] : data;
        const nextThreads = Array.isArray(payload?.threads)
          ? payload.threads.map((thread: any) => normalizeSupportThreadForCustomerWeb(thread))
          : [];
        const nextMessages = Array.isArray(payload?.messages)
          ? payload.messages.map((message: any) => normalizeSupportMessageForCustomerWeb(message))
          : [];

        setSupportThreads(nextThreads);
        setSupportMessages(nextMessages);
        setSelectedSupportThreadId((currentThreadId) => {
          if (currentThreadId && nextThreads.some((thread) => thread.id === currentThreadId)) return currentThreadId;
          return nextThreads[0]?.id ?? null;
        });
        return;
      }
    } catch {
      // Fallback below keeps older local setups working before SQL v352 is installed.
    }

    const threadsResult = await supabase
      .from('support_threads')
      .select('*')
      .eq('sender_type', 'customer')
      .eq('sender_id', profileId)
      .order('last_message_at', { ascending: false })
      .limit(50);

    if (threadsResult.error) {
      setSupportThreads([]);
      setSupportMessages([]);
      return;
    }

    const loadedThreads = (threadsResult.data ?? []).map((thread: any) => normalizeSupportThreadForCustomerWeb(thread)) as SupportThread[];
    setSupportThreads(loadedThreads);
    setSelectedSupportThreadId((currentThreadId) => {
      if (currentThreadId && loadedThreads.some((thread) => thread.id === currentThreadId)) return currentThreadId;
      return loadedThreads[0]?.id ?? null;
    });

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
      setSupportMessages((messagesResult.data ?? []).map((message: any) => normalizeSupportMessageForCustomerWeb(message)) as SupportMessage[]);
    }
  }

  async function ensureWebCustomerProfile(user: User, fallbackName?: string, fallbackPhone?: string) {
    const email = user.email ?? '';

    const existingResult = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (existingResult.error) {
      showSettingsError(existingResult.error.message);
      return null;
    }

    if (existingResult.data) {
      const profile = existingResult.data as CustomerProfile;
      syncCustomerProfileToFields(profile, user);
      await Promise.all([
        loadCustomerOrders(profile.id),
        loadCustomerSavedLocations(profile.id),
        loadCustomerSupport(profile.id),
      ]);
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
      showSettingsError(newProfileResult.error.message);
      return null;
    }

    const profile = newProfileResult.data as CustomerProfile;
    syncCustomerProfileToFields(profile, user);
    await Promise.all([
      loadCustomerOrders(profile.id),
      loadCustomerSavedLocations(profile.id),
      loadCustomerSupport(profile.id),
    ]);
    return profile;
  }

  async function initializeWebCustomerSession() {
    const safetyTimer = window.setTimeout(() => {
      setAuthLoading(false);
    }, DARIK_WEB_AUTH_TIMEOUT_MS);

    try {
      setAuthLoading(true);

      const storedLanguage = window.localStorage.getItem(DARIK_WEB_CUSTOMER_LANGUAGE_KEY);
      if (storedLanguage === 'ar' || storedLanguage === 'en') {
        setCustomerLanguage(storedLanguage);
      }

      const sessionResult = await Promise.race([
        supabase.auth.getSession(),
        darikTimeout(DARIK_WEB_AUTH_TIMEOUT_MS),
      ]);

      if (!sessionResult) {
        setAuthLoading(false);
        return;
      }

      const { data } = sessionResult;

      if (data.session?.user) {
        setCustomerSession(data.session);

        // Do not let profile/order/support loading keep the whole website stuck.
        Promise.race([
          ensureWebCustomerProfile(data.session.user),
          darikTimeout(DARIK_WEB_AUTH_TIMEOUT_MS),
        ]).catch(() => {});

        return;
      }

      setCustomerSession(null);
      setCustomerProfile(null);
    } catch {
      setCustomerSession(null);
      setCustomerProfile(null);
    } finally {
      window.clearTimeout(safetyTimer);
      setAuthLoading(false);
    }
  }

  async function handleWebCustomerLogin() {
    const email = loginEmail.trim().toLowerCase();

    if (!email || loginPassword.length < 6) {
      showSettingsError('Enter your email and password.');
      return;
    }

    try {
      setAuthBusy(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      });

      if (error || !data.session?.user) {
        showSettingsError(error?.message ?? 'Could not log in.');
        return;
      }

      setCustomerSession(data.session);
      await ensureWebCustomerProfile(data.session.user);
      setLoginPassword('');
      setSettingsActiveTool('account');
      showSettingsMessage('Logged in.');
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleWebCustomerSignup() {
    const email = signupEmail.trim().toLowerCase();
    const name = signupName.trim();
    const phone = signupPhone.trim();

    if (name.length < 2 || phone.length < 7 || !email || signupPassword.length < 6) {
      showSettingsError('Enter name, phone, email, and a password with at least 6 characters.');
      return;
    }

    try {
      setAuthBusy(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password: signupPassword,
        options: {
          data: {
            full_name: name,
            phone,
          },
        },
      });

      if (error || !data.user) {
        showSettingsError(error?.message ?? 'Could not create account.');
        return;
      }

      if (data.session) {
        setCustomerSession(data.session);
      }

      await ensureWebCustomerProfile(data.user, name, phone);
      setSignupPassword('');
      setAuthMode('login');
      setSettingsActiveTool('account');
      showSettingsMessage('Customer account created.');
    } finally {
      setAuthBusy(false);
    }
  }

  async function handleWebCustomerLogout() {
    await supabase.auth.signOut();
    setCustomerSession(null);
    setCustomerProfile(null);
    setCustomerOrders([]);
    setCustomerOrderItems([]);
    setSupportThreads([]);
    setSupportMessages([]);
    setSettingsActiveTool('account');
    showSettingsMessage('Logged out.');
  }

  async function changeCustomerLanguage(nextLanguage: AppLanguage) {
    setCustomerLanguage(nextLanguage);
    window.localStorage.setItem(DARIK_WEB_CUSTOMER_LANGUAGE_KEY, nextLanguage);
    window.localStorage.setItem(
      DARIK_WEB_CUSTOMER_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        fullName: customerName,
        phone: customerPhone,
        email: customerEmail,
        customerNumber,
        language: nextLanguage,
      })
    );
  }

  async function openCustomerOrderHistoryFromMenu() {
    openSettingsTool('orders');

    if (!customerProfile?.id) {
      return;
    }

    await loadCustomerOrders(customerProfile.id);
    scrollSettingsToolIntoView('orders');
  }

  async function openCustomerSupportFromMenu() {
    openSettingsTool('support');

    if (!customerProfile?.id) {
      return;
    }

    await loadCustomerSupport(customerProfile.id);
    scrollSettingsToolIntoView('support');
  }

  function openCustomerChangePasswordFromMenu() {
    setNewCustomerPassword('');
    setConfirmCustomerPassword('');
    openSettingsTool('password');
  }

  async function handleCustomerChangePassword() {
    const cleanedPassword = newCustomerPassword.trim();
    const cleanedConfirmPassword = confirmCustomerPassword.trim();

    if (!customerSession?.user) {
      showSettingsError('Log in before changing your password.');
      return;
    }

    if (cleanedPassword.length < 6) {
      showSettingsError(t('passwordTooShort'));
      return;
    }

    if (cleanedPassword !== cleanedConfirmPassword) {
      showSettingsError(t('passwordsDoNotMatch'));
      return;
    }

    try {
      setPasswordBusy(true);
      const { error } = await supabase.auth.updateUser({ password: cleanedPassword });

      if (error) {
        showSettingsError(error.message);
        return;
      }

      setNewCustomerPassword('');
      setConfirmCustomerPassword('');
      showSettingsMessage(t('passwordUpdated'));
    } finally {
      setPasswordBusy(false);
    }
  }

  async function submitSupportThread() {
    if (!customerProfile?.id) {
      showSettingsError('Log in before contacting Darik support.');
      return;
    }

    const cleanSubject = supportSubject.trim();
    const cleanMessage = supportMessageBody.trim();

    if (cleanSubject.length < 3) {
      showSettingsError('Type a short subject for Darik support.');
      return;
    }

    if (cleanMessage.length < 5) {
      showSettingsError('Type a short message explaining what you need help with.');
      return;
    }

    try {
      setSupportBusy(true);
      const { data, error } = await supabase.rpc('customer_create_support_thread_with_message_v2', {
        p_customer_id: customerProfile.id,
        p_customer_name: customerProfile.full_name || customerName || customerSession?.user.email || 'Customer',
        p_customer_phone: customerProfile.phone || customerPhone || null,
        p_customer_email: customerProfile.email || customerSession?.user.email || null,
        p_issue_type: supportIssueType,
        p_subject: cleanSubject,
        p_message_body: cleanMessage,
        p_related_order_id: supportRelatedOrderId,
      });

      if (error) {
        showSettingsError(error.message);
        return;
      }

      const result = Array.isArray(data) ? data[0] : data;
      if (result?.success === false) {
        showSettingsError(result.message || 'Could not send support message.');
        return;
      }

      const createdThread = result?.thread ? normalizeSupportThreadForCustomerWeb(result.thread) : undefined;
      const createdMessagePayload = result?.support_message || result?.message_row || (typeof result?.message === 'object' ? result.message : null);
      const createdMessage = createdMessagePayload ? normalizeSupportMessageForCustomerWeb(createdMessagePayload) : undefined;
      const createdThreadId = String(result?.thread_id || createdThread?.id || '');

      if (createdThread) {
        setSupportThreads((currentThreads) => [
          createdThread,
          ...currentThreads.filter((thread) => thread.id !== createdThread.id),
        ]);
      }

      if (createdMessage) {
        setSupportMessages((currentMessages) => [
          ...currentMessages.filter((message) => message.id !== createdMessage.id),
          createdMessage,
        ]);
      }

      setSupportSubject('');
      setSupportMessageBody('');
      setSupportRelatedOrderId(null);
      if (createdThreadId) {
        setSelectedSupportThreadId(createdThreadId);
      }
      await loadCustomerSupport(customerProfile.id);
      if (createdThreadId) {
        setSelectedSupportThreadId(createdThreadId);
      }
      showSettingsMessage(t('messageSent'));
    } finally {
      setSupportBusy(false);
    }
  }

  async function submitSupportReply(thread: SupportThread) {
    if (!customerProfile?.id) return;

    if (isSupportThreadClosedForCustomer(thread)) {
      showSettingsMessage(getSupportThreadClosedLabel(thread));
      return;
    }

    const cleanReply = supportReplyBody.trim();
    if (cleanReply.length < 2) {
      showSettingsError('Type your reply first.');
      return;
    }

    try {
      setSupportBusy(true);
      const { data, error } = await supabase.rpc('customer_add_support_message_v3', {
        p_thread_id: thread.id,
        p_customer_id: customerProfile.id,
        p_customer_name: customerProfile.full_name || customerName || customerSession?.user.email || 'Customer',
        p_message_body: cleanReply,
      });

      if (error) {
        showSettingsError(error.message);
        return;
      }

      const result = Array.isArray(data) ? data[0] : data;
      if (result?.success === false) {
        showSettingsError(result.message || 'Could not send reply.');
        return;
      }

      const createdMessagePayload = result?.support_message || result?.message_row || (typeof result?.message === 'object' ? result.message : null);
      const createdMessage = createdMessagePayload ? normalizeSupportMessageForCustomerWeb(createdMessagePayload) : undefined;
      if (createdMessage) {
        setSupportMessages((currentMessages) => [
          ...currentMessages.filter((message) => message.id !== createdMessage.id),
          createdMessage,
        ]);
      }

      setSupportReplyBody('');
      await loadCustomerSupport(customerProfile.id);
      setSelectedSupportThreadId(thread.id);
      showSettingsMessage(t('replySent'));
    } finally {
      setSupportBusy(false);
    }
  }

  function openProductDetail(product: Product) {
    shoppingReturnStateRef.current = {
      scrollY: typeof window !== 'undefined' ? window.scrollY : 0,
      categoryId: selectedCategoryId,
      departmentCode: selectedDepartmentCode,
      subcategoryCode: selectedSubcategoryCode,
      searchText,
    };

    setSelectedClothingSize('');
    setSelectedClothingVariantId('');
    setProductImageZoomOpen(false);
    setSelectedProduct(product);

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }

  function returnToShoppingFromProduct() {
    const savedReturnState = shoppingReturnStateRef.current;

    setProductImageZoomOpen(false);
    setSelectedProduct(null);

    if (savedReturnState && typeof window !== 'undefined') {
      setSearchText(savedReturnState.searchText);
      setSelectedCategoryId(savedReturnState.categoryId);
      setSelectedDepartmentCode(savedReturnState.departmentCode);
      setSelectedSubcategoryCode(savedReturnState.subcategoryCode);

      window.setTimeout(() => {
        window.scrollTo({
          top: savedReturnState.scrollY,
          behavior: 'auto',
        });
      }, 80);
    }
  }

  async function loadTopPageData() {
    const safetyTimer = window.setTimeout(() => {
      setLoading(false);
    }, DARIK_WEB_BOOT_TIMEOUT_MS);

    try {
      setLoading(true);

      const topDataResult = await Promise.race([
        Promise.all([
          supabase
            .from('active_customer_ad_banners')
            .select('*')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false })
            .limit(8),
          supabase.from('categories').select('*').order('name', { ascending: true }),
        ]),
        darikTimeout(DARIK_WEB_BOOT_TIMEOUT_MS),
      ]);

      if (!topDataResult) {
        setCategories((currentCategories) => currentCategories.length > 0 ? currentCategories : fallbackCategories);
        return;
      }

      const [bannersResult, categoriesResult] = topDataResult;

      if (!bannersResult.error) {
        setBanners((bannersResult.data ?? []) as CustomerAdBanner[]);
      }

      if (!categoriesResult.error && (categoriesResult.data ?? []).length > 0) {
        setCategories((categoriesResult.data ?? []) as Category[]);
      } else {
        setCategories((currentCategories) => currentCategories.length > 0 ? currentCategories : fallbackCategories);
      }
    } catch {
      setCategories((currentCategories) => currentCategories.length > 0 ? currentCategories : fallbackCategories);
    } finally {
      window.clearTimeout(safetyTimer);
      setLoading(false);
    }
  }

  function appendUniqueProducts(nextProducts: Product[]) {
    setProducts((currentProducts) => {
      const productMap = new Map<string, Product>();

      currentProducts.forEach((product) => {
        productMap.set(product.id, product);
      });

      nextProducts.forEach((product) => {
        productMap.set(product.id, product);
      });

      return Array.from(productMap.values());
    });
  }

  function appendUniqueProductVariants(nextVariants: ProductVariant[]) {
    setProductVariants((currentVariants) => {
      const variantMap = new Map<string, ProductVariant>();

      currentVariants.forEach((variant) => {
        variantMap.set(variant.id, variant);
      });

      nextVariants.forEach((variant) => {
        if (isActiveSellableVariant(variant)) {
          variantMap.set(variant.id, variant);
        }
      });

      return sortProductVariants(Array.from(variantMap.values())).filter(isActiveSellableVariant);
    });
  }

  async function loadProductsForCategoryIds(categoryIds: string[], productLimitPerCategory: number) {
    const cleanCategoryIds = Array.from(
      new Set(categoryIds.map((categoryId) => String(categoryId ?? '').trim()).filter(Boolean))
    );

    const categoriesToLoad = cleanCategoryIds.filter((categoryId) => {
      const alreadyLoadedLimit = loadedProductCategoryLimitRef.current[categoryId] ?? 0;
      return alreadyLoadedLimit < productLimitPerCategory && !loadingProductCategoryRef.current[categoryId];
    });

    if (categoriesToLoad.length === 0) return;

    categoriesToLoad.forEach((categoryId) => {
      loadingProductCategoryRef.current[categoryId] = true;
    });

    const productResults = await Promise.all(
      categoriesToLoad.map((categoryId) =>
        supabase
          .from('public_products')
          .select('*')
          .eq('product_status', 'live')
          .gt('quantity_in_stock', 0)
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false })
          .limit(productLimitPerCategory)
      )
    );

    const nextProducts: Product[] = [];

    productResults.forEach((result, index) => {
      const categoryId = categoriesToLoad[index];

      if (!result.error) {
        const rows = (result.data ?? []) as Product[];
        nextProducts.push(...rows);
        loadedProductCategoryLimitRef.current[categoryId] = Math.max(
          loadedProductCategoryLimitRef.current[categoryId] ?? 0,
          productLimitPerCategory
        );
      }

      loadingProductCategoryRef.current[categoryId] = false;
    });

    appendUniqueProducts(nextProducts);

    const productIds = nextProducts.map((product) => product.id).filter(Boolean);

    if (productIds.length > 0) {
      const variantsResult = await supabase
        .from('public_product_variants')
        .select('*')
        .in('product_id', productIds)
        .gt('quantity_in_stock', 0)
        .order('size_sort_order', { ascending: true });

      if (!variantsResult.error) {
        appendUniqueProductVariants((variantsResult.data ?? []) as ProductVariant[]);
      }
    }
  }

  async function loadCatalogAfterScroll() {
    if (catalogLoadStartedRef.current || catalogLoaded) return;

    catalogLoadStartedRef.current = true;
    setCatalogDeferredLoading(true);

    const subcategoriesResult = await supabase
      .from('marketplace_category_subcategories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (!subcategoriesResult.error) {
      setMarketplaceCategorySubcategories((subcategoriesResult.data ?? []) as MarketplaceCategorySubcategory[]);
    }

    const currentCategories = categories.length > 0 ? sortDarikCustomerCategories(categories) : sortDarikCustomerCategories(fallbackCategories);

    setVisibleFeaturedDepartmentCount(FEATURED_DEPARTMENTS_PER_LOAD);
    setFeaturedProductPageByDepartment({});
    lastFeaturedBatchLoadScrollYRef.current = 0;

    await loadProductsForCategoryIds(
      currentCategories.slice(0, FEATURED_DEPARTMENTS_PER_LOAD).map((category) => category.id),
      FEATURED_PRODUCTS_PREFETCH_PER_CATEGORY
    );

    setCatalogLoaded(true);
    setCatalogDeferredLoading(false);
  }

  useEffect(() => {
    const safetyTimer = window.setTimeout(() => {
      setLoading(false);
    }, DARIK_WEB_BOOT_TIMEOUT_MS + 1000);

    loadTopPageData()
      .catch(() => setLoading(false))
      .finally(() => window.clearTimeout(safetyTimer));

    return () => window.clearTimeout(safetyTimer);
  }, []);

  useEffect(() => {
    const resetRequested = new URLSearchParams(window.location.search).get('reset') === '1';

    if (!resetRequested) return;

    try {
      Object.keys(window.localStorage)
        .filter((key) => key.toLowerCase().includes('darik') || key.toLowerCase().includes('supabase'))
        .forEach((key) => window.localStorage.removeItem(key));

      Object.keys(window.sessionStorage)
        .filter((key) => key.toLowerCase().includes('darik') || key.toLowerCase().includes('supabase'))
        .forEach((key) => window.sessionStorage.removeItem(key));
    } finally {
      window.location.replace('/');
    }
  }, []);


  useEffect(() => {
    initializeWebCustomerSession().catch(() => setAuthLoading(false));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCustomerSession(session);
      setAuthLoading(false);

      if (session?.user) {
        Promise.race([
          ensureWebCustomerProfile(session.user),
          darikTimeout(DARIK_WEB_AUTH_TIMEOUT_MS),
        ]).catch(() => {});
      } else {
        setCustomerProfile(null);
        setCustomerOrders([]);
        setCustomerOrderItems([]);
        setDarikReturnRequests([]);
        setSupportThreads([]);
        setSupportMessages([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authLoading || !checkoutOpen) return;

    if (!customerSession?.user || !customerProfile?.id) {
      setCheckoutOpen(false);
      openCheckoutAccountGate();
    }
  }, [authLoading, checkoutOpen, customerProfile?.id, customerSession?.user]);

  useEffect(() => {
    try {
      const storedCart = safeReadDarikJson(DARIK_WEB_CART_STORAGE_KEY, []);
      const storedSavedForLater = safeReadDarikJson(DARIK_WEB_SAVE_FOR_LATER_STORAGE_KEY, []);
      const storedSavedLocations = safeReadDarikJson(DARIK_WEB_SAVED_LOCATIONS_STORAGE_KEY, []);
      const storedCustomerSettings = safeReadDarikJson<Record<string, unknown> | null>(DARIK_WEB_CUSTOMER_SETTINGS_STORAGE_KEY, null);
      const storedCustomerLanguage = window.localStorage.getItem(DARIK_WEB_CUSTOMER_LANGUAGE_KEY);

      setCartItems(normalizeStoredCartItems(storedCart));
      setSavedForLaterItems(normalizeStoredCartItems(storedSavedForLater));
      setSavedLocations(normalizeStoredLocations(storedSavedLocations));

      if (storedCustomerSettings) {
        const profile = normalizeStoredCustomerSettings(storedCustomerSettings);
        setCustomerName(profile.fullName);
        setCustomerPhone(profile.phone);
        setCustomerEmail(profile.email);
        setCustomerNumber(profile.customerNumber);
        setCustomerLanguage(profile.language);
      }

      if (storedCustomerLanguage === 'ar' || storedCustomerLanguage === 'en') {
        setCustomerLanguage(storedCustomerLanguage);
      }
    } catch {
      setCartItems([]);
      setSavedForLaterItems([]);
      setSavedLocations([]);
    } finally {
      setCartStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!cartStorageReady) return;

    window.localStorage.setItem(DARIK_WEB_CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, cartStorageReady]);

  useEffect(() => {
    if (!cartStorageReady) return;

    window.localStorage.setItem(DARIK_WEB_SAVE_FOR_LATER_STORAGE_KEY, JSON.stringify(savedForLaterItems));
  }, [savedForLaterItems, cartStorageReady]);

  useEffect(() => {
    if (!cartStorageReady) return;

    window.localStorage.setItem(DARIK_WEB_SAVED_LOCATIONS_STORAGE_KEY, JSON.stringify(savedLocations));
  }, [savedLocations, cartStorageReady]);

  useEffect(() => {
    if (!cartStorageReady) return;

    window.localStorage.setItem(
      DARIK_WEB_CUSTOMER_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        fullName: customerName,
        phone: customerPhone,
        email: customerEmail,
        customerNumber,
        language: customerLanguage,
      })
    );
    window.localStorage.setItem(DARIK_WEB_CUSTOMER_LANGUAGE_KEY, customerLanguage);
  }, [cartStorageReady, customerEmail, customerLanguage, customerName, customerNumber, customerPhone]);

  const visibleCategories = useMemo(() => {
    const sourceCategories = categories.length > 0 ? categories : fallbackCategories;
    return sortDarikCustomerCategories(sourceCategories);
  }, [categories]);

  const categoryById = useMemo(() => {
    return new Map(categories.map((category) => [category.id, category]));
  }, [categories]);

  const productVariantsByProductId = useMemo(() => {
    const variantMap = new Map<string, ProductVariant[]>();

    productVariants.forEach((variant) => {
      const productId = String(variant.product_id ?? '').trim();
      if (!productId) return;

      const currentRows = variantMap.get(productId) ?? [];
      currentRows.push(variant);
      variantMap.set(productId, sortProductVariants(currentRows));
    });

    return variantMap;
  }, [productVariants]);

  function getVariantsForProduct(product: Product | null | undefined) {
    if (!product) return [];
    return productVariantsByProductId.get(product.id) ?? [];
  }

  function getSelectedVariantForProduct(product: Product | null | undefined, variantId?: string, sizeLabel?: string) {
    const variants = getVariantsForProduct(product);
    const cleanVariantId = String(variantId ?? '').trim();
    const cleanSizeLabel = String(sizeLabel ?? '').trim().toLowerCase();

    if (cleanVariantId) {
      const matchedVariant = variants.find((variant) => variant.id === cleanVariantId);
      if (matchedVariant) return matchedVariant;
    }

    if (cleanSizeLabel) {
      const matchedVariant = variants.find((variant) => String(variant.size_label ?? '').trim().toLowerCase() === cleanSizeLabel);
      if (matchedVariant) return matchedVariant;
    }

    return variants.length === 1 ? variants[0] : null;
  }

  const selectedCategoryName =
    selectedCategoryId === 'BestSellers' || selectedCategoryId === 'All'
      ? ''
      : categoryById.get(selectedCategoryId)?.name ?? '';

  const selectedCategoryCode = normalizeMarketplaceCategoryCode(selectedCategoryName);

  const selectedCategorySubcategoryRows = useMemo(() => {
    if (!selectedCategoryCode) return [];

    return marketplaceCategorySubcategories.filter((row) => {
      const rowCategoryCode = normalizeMarketplaceCategoryCode(row.category_code || '');
      const rowDepartmentCode = normalizeMarketplaceCategoryCode(row.department_code || '');
      const rowCategoryName = normalizeMarketplaceCategoryCode(row.category_name_match || '');
      const selectedCode = normalizeMarketplaceCategoryCode(selectedCategoryCode);
      const selectedNameCode = normalizeMarketplaceCategoryCode(selectedCategoryName);

      return (
        rowCategoryCode === selectedCode ||
        rowDepartmentCode === selectedCode ||
        rowCategoryName === selectedCode ||
        rowCategoryCode === selectedNameCode ||
        rowDepartmentCode === selectedNameCode ||
        rowCategoryName === selectedNameCode
      );
    });
  }, [marketplaceCategorySubcategories, selectedCategoryCode]);

  const selectedCategoryHasSubcategories = selectedCategorySubcategoryRows.length > 0;

  const selectedCategoryDepartmentOptions = useMemo(() => {
    const departmentMap = new Map<string, SubcategoryChip>();

    selectedCategorySubcategoryRows.forEach((row) => {
      const departmentCode = normalizeMarketplaceCategoryCode(row.department_code || selectedCategoryCode);
      if (!departmentCode || departmentMap.has(departmentCode)) return;

      departmentMap.set(departmentCode, {
        id: departmentCode,
        label: row.department_name_en || row.category_name_match || selectedCategoryName || departmentCode,
      });
    });

    return Array.from(departmentMap.values());
  }, [selectedCategoryCode, selectedCategoryName, selectedCategorySubcategoryRows]);

  const selectedCategoryHasMultipleDepartments = selectedCategoryDepartmentOptions.length > 1;

  const selectedCategoryItemTypeOptions = useMemo(() => {
    const rowsForDepartment =
      selectedDepartmentCode !== 'All'
        ? selectedCategorySubcategoryRows.filter(
            (row) => normalizeMarketplaceCategoryCode(row.department_code || selectedCategoryCode) === normalizeMarketplaceCategoryCode(selectedDepartmentCode)
          )
        : selectedCategorySubcategoryRows;

    const itemTypeMap = new Map<string, SubcategoryChip>();

    rowsForDepartment.forEach((row) => {
      const itemTypeCode = normalizeMarketplaceCategoryCode(row.item_type_code);
      if (!itemTypeCode || itemTypeMap.has(itemTypeCode)) return;

      itemTypeMap.set(itemTypeCode, {
        id: itemTypeCode,
        label: row.item_type_name_en || stripSubcategoryLeaf(row.subcategory_name_en) || itemTypeCode,
        departmentCode: normalizeMarketplaceCategoryCode(row.department_code || selectedCategoryCode),
      });
    });

    return Array.from(itemTypeMap.values());
  }, [selectedCategoryCode, selectedCategorySubcategoryRows, selectedDepartmentCode]);

  useEffect(() => {
    setSelectedDepartmentCode('All');
    setSelectedSubcategoryCode('All');
  }, [selectedCategoryId]);

  useEffect(() => {
    setSelectedSubcategoryCode('All');
  }, [selectedDepartmentCode]);

  const filteredProducts = useMemo(() => {
    const cleanSearch = searchText.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = productMatchesMainCategory(
        product,
        selectedCategoryId,
        selectedCategoryName,
        selectedCategoryCode
      );

      if (!matchesCategory) return false;

      if (
        selectedCategoryId !== 'BestSellers' &&
        selectedCategoryHasSubcategories &&
        (selectedDepartmentCode !== 'All' || selectedSubcategoryCode !== 'All') &&
        !productMatchesSubcategory(product, selectedDepartmentCode, selectedSubcategoryCode, selectedCategorySubcategoryRows)
      ) {
        return false;
      }

      if (!cleanSearch) return true;

      const categoryName = product.category_id ? categoryById.get(product.category_id)?.name ?? '' : '';

      return [product.name, product.description, categoryName, product.subcategory_name, product.clothing_department, product.clothing_item_type]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(cleanSearch);
    });
  }, [
    products,
    searchText,
    selectedCategoryId,
    categoryById,
    selectedCategoryHasSubcategories,
    selectedDepartmentCode,
    selectedSubcategoryCode,
    selectedCategorySubcategoryRows,
    selectedCategoryName,
    selectedCategoryCode,
  ]);

  const visibleCategoryProducts = useMemo(() => {
    if (selectedCategoryId === 'BestSellers') return filteredProducts;
    return filteredProducts.slice(0, visibleCategoryProductCount);
  }, [filteredProducts, selectedCategoryId, visibleCategoryProductCount]);

  const hasMoreCategoryProducts =
    selectedCategoryId !== 'BestSellers' && visibleCategoryProductCount < filteredProducts.length;

  useEffect(() => {
    if (selectedCategoryId === 'BestSellers') return;

    setVisibleCategoryProductCount(CATEGORY_PRODUCTS_PER_LOAD);
    lastCategoryBatchLoadScrollYRef.current = 0;
  }, [selectedCategoryId, selectedDepartmentCode, selectedSubcategoryCode, searchText]);

  useEffect(() => {
    if (selectedCategoryId === 'BestSellers' || !catalogLoaded) return;

    function handleCategoryProductScrollLoad() {
      if (!hasMoreCategoryProducts) return;

      const productGrid = document.querySelector<HTMLElement>('.categoryProductsGrid');
      if (!productGrid) return;

      const currentScrollY = window.scrollY;

      if (
        lastCategoryBatchLoadScrollYRef.current > 0 &&
        currentScrollY < lastCategoryBatchLoadScrollYRef.current + 160
      ) {
        return;
      }

      const gridBottom = productGrid.getBoundingClientRect().bottom;
      const immediateLoadLine = window.innerHeight + 220;

      if (gridBottom <= immediateLoadLine) {
        setVisibleCategoryProductCount((currentCount) => {
          if (currentCount >= filteredProducts.length) return currentCount;

          lastCategoryBatchLoadScrollYRef.current = currentScrollY;
          return Math.min(currentCount + CATEGORY_PRODUCTS_PER_LOAD, filteredProducts.length);
        });
      }
    }

    window.addEventListener('scroll', handleCategoryProductScrollLoad, { passive: true });
    window.addEventListener('resize', handleCategoryProductScrollLoad);

    return () => {
      window.removeEventListener('scroll', handleCategoryProductScrollLoad);
      window.removeEventListener('resize', handleCategoryProductScrollLoad);
    };
  }, [
    selectedCategoryId,
    catalogLoaded,
    hasMoreCategoryProducts,
    filteredProducts.length,
    visibleCategoryProductCount,
  ]);

  const visibleBestSellerDepartments = useMemo(() => {
    const cleanSearch = searchText.trim().toLowerCase();

    if (!cleanSearch) return visibleCategories;

    return visibleCategories.filter((category) => {
      const categoryText = [category.name, category.description].filter(Boolean).join(' ').toLowerCase();
      const categoryHasMatchingLoadedProducts = products.some((product) => {
        if (product.category_id !== category.id) return false;

        return [product.name, product.description, category.name]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(cleanSearch);
      });

      return categoryText.includes(cleanSearch) || categoryHasMatchingLoadedProducts;
    });
  }, [visibleCategories, products, searchText]);

  const visibleFeaturedDepartmentsToRender = useMemo(() => {
    return visibleBestSellerDepartments.slice(0, visibleFeaturedDepartmentCount);
  }, [visibleBestSellerDepartments, visibleFeaturedDepartmentCount]);

  useEffect(() => {
    if (selectedCategoryId !== 'BestSellers') return;

    setVisibleFeaturedDepartmentCount(FEATURED_DEPARTMENTS_PER_LOAD);
    setFeaturedProductPageByDepartment({});
    lastFeaturedBatchLoadScrollYRef.current = 0;
  }, [searchText, selectedCategoryId]);

  useEffect(() => {
    if (!catalogLoaded) return;

    if (selectedCategoryId === 'BestSellers') {
      loadProductsForCategoryIds(
        visibleFeaturedDepartmentsToRender.map((category) => category.id),
        FEATURED_PRODUCTS_PREFETCH_PER_CATEGORY
      ).catch(() => undefined);
      return;
    }

    loadProductsForCategoryIds([selectedCategoryId], CATEGORY_PRODUCTS_PREFETCH_PER_CATEGORY).catch(() => undefined);
  }, [catalogLoaded, selectedCategoryId, visibleFeaturedDepartmentCount, selectedDepartmentCode, selectedSubcategoryCode]);

  useEffect(() => {
    if (selectedCategoryId !== 'BestSellers' || !catalogLoaded) return;

    function handleFeaturedScrollLoad() {
      const featuredSections = Array.from(
        document.querySelectorAll<HTMLElement>('.featuredItemsTightSection .bestSellerDepartmentSection')
      );

      if (featuredSections.length === 0) return;

      const currentScrollY = window.scrollY;

      // Prevent chain-loading all departments immediately after the catalog appears.
      // After one batch loads, the customer must scroll farther before the next batch can load.
      if (
        lastFeaturedBatchLoadScrollYRef.current > 0 &&
        currentScrollY < lastFeaturedBatchLoadScrollYRef.current + 140
      ) {
        return;
      }

      const lastLoadedSection = featuredSections[featuredSections.length - 1];
      const lastLoadedSectionBottom = lastLoadedSection.getBoundingClientRect().bottom;
      const immediateLoadLine = window.innerHeight + 120;

      if (lastLoadedSectionBottom <= immediateLoadLine) {
        setVisibleFeaturedDepartmentCount((currentCount) => {
          if (currentCount >= visibleBestSellerDepartments.length) return currentCount;

          lastFeaturedBatchLoadScrollYRef.current = currentScrollY;
          return Math.min(currentCount + FEATURED_DEPARTMENTS_PER_LOAD, visibleBestSellerDepartments.length);
        });
      }
    }

    window.addEventListener('scroll', handleFeaturedScrollLoad, { passive: true });
    window.addEventListener('resize', handleFeaturedScrollLoad);

    return () => {
      window.removeEventListener('scroll', handleFeaturedScrollLoad);
      window.removeEventListener('resize', handleFeaturedScrollLoad);
    };
  }, [selectedCategoryId, visibleBestSellerDepartments.length, catalogLoaded]);

  function getFeaturedProductPage(departmentId: string) {
    return featuredProductPageByDepartment[departmentId] ?? 0;
  }

  function showNextFeaturedProducts(departmentId: string, totalProducts: number) {
    const currentLoadedLimit = loadedProductCategoryLimitRef.current[departmentId] ?? FEATURED_PRODUCTS_PREFETCH_PER_CATEGORY;
    const nextLimit = currentLoadedLimit + FEATURED_PRODUCTS_PREFETCH_PER_CATEGORY;

    loadProductsForCategoryIds([departmentId], nextLimit).catch(() => undefined);

    setFeaturedProductPageByDepartment((currentPages) => {
      const currentPage = currentPages[departmentId] ?? 0;
      const maxPage = Math.max(0, Math.ceil(Math.max(totalProducts, nextLimit) / FEATURED_PRODUCTS_PER_PAGE) - 1);

      return {
        ...currentPages,
        [departmentId]: Math.min(currentPage + 1, maxPage),
      };
    });
  }

  function showPreviousFeaturedProducts(departmentId: string) {
    setFeaturedProductPageByDepartment((currentPages) => {
      const currentPage = currentPages[departmentId] ?? 0;

      return {
        ...currentPages,
        [departmentId]: Math.max(currentPage - 1, 0),
      };
    });
  }

  function getBestSellerDepartmentProducts(categoryId: string) {
    const cleanSearch = searchText.trim().toLowerCase();

    return products
      .filter((product) => {
        if (product.category_id !== categoryId) return false;

        if (!cleanSearch) return true;

        const categoryName = product.category_id ? categoryById.get(product.category_id)?.name ?? '' : '';

        return [product.name, product.description, categoryName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(cleanSearch);
      });
  }

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.priceNumber * item.quantity, 0);
  }, [cartItems]);

  const freeNextDayUnlocked = subtotal >= FREE_NEXT_DAY_MIN_ORDER;
  const checkoutLatitudeNumber = Number(manualLatitude);
  const checkoutLongitudeNumber = Number(manualLongitude);
  const checkoutDistanceKm =
    Number.isFinite(checkoutLatitudeNumber) && Number.isFinite(checkoutLongitudeNumber)
      ? getDistanceKmFromWarehouse(checkoutLatitudeNumber, checkoutLongitudeNumber)
      : null;
  const checkoutDeliveryRadiusWarning = getDeliveryRadiusWarning(checkoutDistanceKm, selectedDeliveryOption);

  useEffect(() => {
    if (cartItems.length === 0) return;
    if (selectedDeliveryOption !== 'next_day_free') return;
    if (freeNextDayUnlocked) return;

    // Do not auto-select Express. Customer must manually choose delivery.
    setSelectedDeliveryOption('');
  }, [cartItems.length, freeNextDayUnlocked, selectedDeliveryOption]);

  const selectedDeliveryFee =
    cartItems.length === 0 || !selectedDeliveryOption
      ? 0
      : selectedDeliveryOption === 'next_day_free' && freeNextDayUnlocked
        ? 0
        : EXPRESS_DELIVERY_FEE;
  const deliveryFee = selectedDeliveryFee;
  const deliveryEtaLabel = buildDeliveryEtaLabel(selectedDeliveryOption);
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (checkoutDistanceKm === null) return;
    if (selectedDeliveryOption !== 'express_2hr') return;

    const expressIsBlocked = checkoutDistanceKm > EXPRESS_DELIVERY_RADIUS_KM;

    if (expressIsBlocked) {
      // Do not auto-select Free Next-Day. Customer must manually choose delivery.
      setSelectedDeliveryOption('');
    }
  }, [checkoutDistanceKm, selectedDeliveryOption]);

  const visibleAdBanners = useMemo<CustomerAdBanner[]>(() => {
    const darikPermanentBanner: CustomerAdBanner = {
      id: 'permanent-darik-delivery-banner',
      retailer_id: null,
      banner_status: 'active',
      sponsor_name: 'Darik Marketplace',
      headline: 'Darik Delivery',
      subheadline: 'Essentials delivered fast around Amman.',
      cta_label: 'CLICK TO SHOP',
      banner_image_url: '/darik_under_2_hours_banner.png',
      background_color: '#111111',
      text_color: '#FFFFFF',
      accent_color: '#FFD23F',
      sort_order: 9999,
    };

    return banners.length > 0 ? [...banners, darikPermanentBanner] : [darikPermanentBanner];
  }, [banners]);


  useEffect(() => {
    function handleHeaderScroll() {
      const shouldShrinkHeader = window.scrollY > 40;
      setHeaderShrunk(shouldShrinkHeader);

      if (shouldShrinkHeader) {
        loadCatalogAfterScroll().catch(() => setCatalogDeferredLoading(false));
      }
    }

    // Important: do NOT call handleHeaderScroll() on mount.
    // Some browsers restore scroll position after refresh, which made the catalog load immediately.
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleHeaderScroll);
    };
  }, [catalogLoaded]);

  useEffect(() => {
    setSelectedClothingSize('');
    setSelectedClothingVariantId('');
    setProductImageZoomOpen(false);
  }, [selectedProduct?.id]);


  useEffect(() => {
    if (visibleAdBanners.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveBannerIndex((current) => (current + 1) % visibleAdBanners.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [visibleAdBanners.length]);


  function addToCart(product: Product, requestedSize?: string, requestedVariant?: ProductVariant | null) {
    const requiresSize = productRequiresSize(product, categoryById);
    const variantsForProduct = getVariantsForProduct(product);
    const sizeOptions = getProductSizeOptions(product, variantsForProduct);
    const cleanRequestedSize = String(requestedSize ?? '').trim();
    const singleSize = getProductSingleSize(product);
    const selectedVariant =
      requestedVariant ||
      getSelectedVariantForProduct(product, undefined, cleanRequestedSize) ||
      (variantsForProduct.length === 1 ? variantsForProduct[0] : null);
    const finalSize =
      selectedVariant?.size_label ||
      cleanRequestedSize ||
      (sizeOptions.length === 1 ? sizeOptions[0] : singleSize);

    if (requiresSize && !selectedVariant && variantsForProduct.length > 0) {
      openProductDetail(product);
      setSelectedClothingSize('');
      setSelectedClothingVariantId('');
      return;
    }

    if (requiresSize && !finalSize) {
      openProductDetail(product);
      setSelectedClothingSize('');
      setSelectedClothingVariantId('');
      return;
    }

    const availableStock = selectedVariant
      ? Number(selectedVariant.quantity_in_stock ?? 0)
      : Number(product.quantity_in_stock ?? 0);

    if (requiresSize && selectedVariant && availableStock <= 0) {
      return;
    }

    const photoUrl = getProductPhotoUrl(product);
    const priceNumber = getCustomerPrice(product);
    const sizeKey = selectedVariant?.id || getCartItemSizeKey(finalSize);
    const cartLineId = `${product.id}::${sizeKey}`;

    setCartItems((current) => {
      const existing = current.find((item) => item.id === cartLineId);
      const currentQuantity = existing?.quantity ?? 0;

      if (availableStock > 0 && currentQuantity + 1 > availableStock) {
        return current;
      }

      if (existing) {
        return current.map((item) =>
          item.id === cartLineId ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [
        ...current,
        {
          id: cartLineId,
          productId: product.id,
          name: getCartItemLabel(product, finalSize),
          priceNumber,
          quantity: 1,
          photoUrl,
          selectedCartSize: finalSize || null,
          productVariantId: selectedVariant?.id ?? null,
          variantSku: selectedVariant?.variant_sku ?? null,
          variantWarehouseLocation: selectedVariant?.warehouse_location ?? null,
        },
      ];
    });
  }

  function decreaseQuantity(cartLineId: string) {
    setCartItems((current) =>
      current
        .map((item) =>
          item.id === cartLineId ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function increaseQuantity(cartLineId: string) {
    const cartItem = cartItems.find((item) => item.id === cartLineId);
    if (!cartItem) return;

    const product = products.find((item) => item.id === cartItem.productId);
    if (!product) return;

    const selectedVariant = cartItem.productVariantId
      ? productVariants.find((variant) => variant.id === cartItem.productVariantId) ?? null
      : null;

    addToCart(product, cartItem.selectedCartSize ?? undefined, selectedVariant);
  }

  function getCartItemAvailableStock(item: CartItem) {
    if (item.productVariantId) {
      const variant = productVariants.find((row) => row.id === item.productVariantId);
      return Math.max(0, Number(variant?.quantity_in_stock ?? 0));
    }

    const product = products.find((row) => row.id === item.productId);
    return Math.max(0, Number(product?.quantity_in_stock ?? 0));
  }

  function cartItemIsAtStockLimit(item: CartItem) {
    const availableStock = getCartItemAvailableStock(item);
    return availableStock > 0 && item.quantity >= availableStock;
  }

  async function saveCustomerSettingsFromPanel() {
    const cleanName = customerName.trim();
    const cleanPhone = customerPhone.trim();
    const cleanEmail = customerEmail.trim();

    window.localStorage.setItem(
      DARIK_WEB_CUSTOMER_SETTINGS_STORAGE_KEY,
      JSON.stringify({
        fullName: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        customerNumber: customerNumber.trim(),
        language: customerLanguage,
      })
    );
    window.localStorage.setItem(DARIK_WEB_CUSTOMER_LANGUAGE_KEY, customerLanguage);

    if (customerProfile?.id) {
      const { data, error } = await supabase
        .from('customers')
        .update({
          full_name: cleanName || customerProfile.full_name || customerSession?.user.email || 'Customer',
          phone: cleanPhone,
          email: cleanEmail || customerSession?.user.email || customerProfile.email,
        })
        .eq('id', customerProfile.id)
        .select('*')
        .single();

      if (error) {
        showSettingsError(error.message);
        return;
      }

      syncCustomerProfileToFields(data as CustomerProfile, customerSession?.user ?? null);
      showSettingsMessage(t('accountUpdated'));
      return;
    }

    showSettingsMessage(t('settingsSaved'));
  }

  async function useSavedLocationFromSettings(locationId: string) {
    applySavedLocation(locationId);

    if (!customerSession?.user || !customerProfile?.id) {
      openCheckoutAccountGate();
      return;
    }

    setSettingsOpen(false);
    openCheckoutFromCart();
  }

  async function clearWebCustomerSettings() {
    if (customerSession) {
      await handleWebCustomerLogout();
      return;
    }

    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setCustomerNumber('');
    setCustomerLanguage('en');
    setSettingsSavedMessage('Customer settings cleared.');
  }

  function applySavedLocation(locationId: string) {
    const savedLocation = savedLocations.find((item) => item.id === locationId);
    setSelectedSavedLocationId(locationId);

    if (!savedLocation) return;

    setManualLatitude(savedLocation.latitude);
    setManualLongitude(savedLocation.longitude);
    setDeliveryAddressDetails(savedLocation.addressDetails);
    setDeliveryNote(savedLocation.deliveryNote ?? '');

    const savedLatitude = Number(savedLocation.latitude);
    const savedLongitude = Number(savedLocation.longitude);

    if (Number.isFinite(savedLatitude) && Number.isFinite(savedLongitude)) {
      const distanceKm = getDistanceKmFromWarehouse(savedLatitude, savedLongitude);

      if (distanceKm > NEXT_DAY_DELIVERY_RADIUS_KM) {
        setLocationMessage(`Using saved location: ${savedLocation.label}. It is ${distanceKm.toFixed(1)} km from the warehouse, outside the ${NEXT_DAY_DELIVERY_RADIUS_KM} km delivery area.`);
      } else if (distanceKm > EXPRESS_DELIVERY_RADIUS_KM) {
        if (freeNextDayUnlocked) {
          setSelectedDeliveryOption('next_day_free');
          setLocationMessage(`Using saved location: ${savedLocation.label}. It is ${distanceKm.toFixed(1)} km away, so Express is blocked and Next-Day was selected.`);
        } else {
          setLocationMessage(`Using saved location: ${savedLocation.label}. It is ${distanceKm.toFixed(1)} km away. Express is blocked past ${EXPRESS_DELIVERY_RADIUS_KM} km. Add enough items to reach ${FREE_NEXT_DAY_MIN_ORDER.toFixed(2)} JOD for Next-Day delivery.`);
        }
      } else {
        setLocationMessage(`Using saved location: ${savedLocation.label}. Distance from warehouse: ${distanceKm.toFixed(1)} km.`);
      }
    } else {
      setLocationMessage(`Using saved location: ${savedLocation.label}`);
    }
  }

  async function saveCurrentCheckoutLocation() {
    const cleanName = newLocationName.trim();
    const cleanLatitude = manualLatitude.trim();
    const cleanLongitude = manualLongitude.trim();
    const cleanAddress = deliveryAddressDetails.trim();

    if (!cleanName) {
      setLocationMessage('Name this location before saving it.');
      return false;
    }

    if (!cleanLatitude || !cleanLongitude) {
      setLocationMessage('Choose current location or enter GPS before saving.');
      return false;
    }

    if (!customerProfile?.id) {
      setLocationMessage('Log in before saving a delivery location. Guest checkout is not available.');
      openCheckoutAccountGate();
      return false;
    }

    if (customerProfile?.id) {
      const { data, error } = await supabase
        .from('customer_saved_locations')
        .insert({
          customer_id: customerProfile.id,
          label: cleanName,
          latitude: Number(cleanLatitude),
          longitude: Number(cleanLongitude),
          address_details: cleanAddress || null,
        })
        .select('*')
        .single();

      if (error) {
        setLocationMessage(error.message);
        return false;
      }

      const savedLocation = normalizeDbSavedLocation(data);
      setSavedLocations((currentLocations) => {
        const withoutSameName = currentLocations.filter(
          (item) => item.label.trim().toLowerCase() !== cleanName.toLowerCase()
        );
        return [savedLocation, ...withoutSameName].slice(0, 20);
      });

      setSelectedSavedLocationId(savedLocation.id);
      setSaveLocationForFuture(false);
      setLocationMessage(`Saved location: ${cleanName}`);
      return true;
    }

    const savedLocation: SavedLocation = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      label: cleanName,
      latitude: cleanLatitude,
      longitude: cleanLongitude,
      addressDetails: cleanAddress,
      deliveryNote: deliveryNote.trim() || null,
      createdAt: new Date().toISOString(),
    };

    setSavedLocations((currentLocations) => {
      const withoutSameName = currentLocations.filter(
        (item) => item.label.trim().toLowerCase() !== cleanName.toLowerCase()
      );

      return [savedLocation, ...withoutSameName].slice(0, 8);
    });

    setSelectedSavedLocationId(savedLocation.id);
    setSaveLocationForFuture(false);
    setLocationMessage(`Saved location: ${cleanName}`);
    return true;
  }

  async function removeSavedLocation(locationId: string) {
    if (customerProfile?.id) {
      await supabase
        .from('customer_saved_locations')
        .delete()
        .eq('id', locationId)
        .eq('customer_id', customerProfile.id);
    }

    setSavedLocations((currentLocations) => currentLocations.filter((item) => item.id !== locationId));

    if (selectedSavedLocationId === locationId) {
      setSelectedSavedLocationId('');
    }
  }

  function useCurrentLocationForCheckout() {
    setLocationMessage('');

    if (!navigator.geolocation) {
      setLocationMessage('Current location is not supported on this browser.');
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const distanceKm = getDistanceKmFromWarehouse(latitude, longitude);

        setManualLatitude(latitude.toFixed(6));
        setManualLongitude(longitude.toFixed(6));
        setSelectedSavedLocationId('');

        if (distanceKm > NEXT_DAY_DELIVERY_RADIUS_KM) {
          setLocationMessage(`Current location is ${distanceKm.toFixed(1)} km from the Darik warehouse. This is outside the ${NEXT_DAY_DELIVERY_RADIUS_KM} km delivery area.`);
        } else if (distanceKm > EXPRESS_DELIVERY_RADIUS_KM) {
          if (freeNextDayUnlocked) {
            setSelectedDeliveryOption('next_day_free');
            setLocationMessage(`Current location is ${distanceKm.toFixed(1)} km away. Express is not available past ${EXPRESS_DELIVERY_RADIUS_KM} km, so Next-Day was selected.`);
          } else {
            setLocationMessage(`Current location is ${distanceKm.toFixed(1)} km away. Express is blocked past ${EXPRESS_DELIVERY_RADIUS_KM} km. Add enough items to reach ${FREE_NEXT_DAY_MIN_ORDER.toFixed(2)} JOD for Next-Day delivery.`);
          }
        } else {
          setLocationMessage(`Current location added. Distance from warehouse: ${distanceKm.toFixed(1)} km. Add address details so the driver can find you.`);
        }

        setLocationLoading(false);
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? 'Location permission was denied. Allow location access or enter GPS manually.'
            : 'Could not get current location. Try again or enter GPS manually.';

        setLocationMessage(message);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 30000,
      }
    );
  }

  function saveCartItemForLater(cartLineId: string) {
    setCartItems((currentCartItems) => {
      const itemToSave = currentCartItems.find((item) => item.id === cartLineId);
      if (!itemToSave) return currentCartItems;

      setSavedForLaterItems((currentSavedItems) => {
        const existingSavedItem = currentSavedItems.find((item) => item.id === itemToSave.id);

        if (existingSavedItem) {
          return currentSavedItems.map((item) =>
            item.id === itemToSave.id
              ? { ...item, quantity: 1 }
              : item
          );
        }

        return [...currentSavedItems, { ...itemToSave, quantity: 1 }];
      });

      return currentCartItems.filter((item) => item.id !== cartLineId);
    });
  }

  function removeSavedForLaterItem(cartLineId: string) {
    setSavedForLaterItems((currentSavedItems) => currentSavedItems.filter((item) => item.id !== cartLineId));
  }

  function moveSavedItemToCart(cartLineId: string) {
    setSavedForLaterItems((currentSavedItems) => {
      const savedItem = currentSavedItems.find((item) => item.id === cartLineId);
      if (!savedItem) return currentSavedItems;

      const availableStock = getCartItemAvailableStock(savedItem);

      if (availableStock === 0) {
        return currentSavedItems;
      }

      const itemToMove = { ...savedItem, quantity: 1 };

      setCartItems((currentCartItems) => {
        const existingCartItem = currentCartItems.find((item) => item.id === itemToMove.id);

        if (existingCartItem) {
          return currentCartItems.map((item) =>
            item.id === itemToMove.id ? { ...item, quantity: Math.max(1, item.quantity) } : item
          );
        }

        return [...currentCartItems, itemToMove];
      });

      return currentSavedItems.filter((item) => item.id !== cartLineId);
    });
  }

  function getCheckoutProductForCartItem(item: CartItem) {
    return products.find((product) => product.id === item.productId) ?? null;
  }

  function getCheckoutVariantForCartItem(item: CartItem) {
    if (!item.productVariantId) return null;
    return productVariants.find((variant) => variant.id === item.productVariantId) ?? null;
  }

  function openCheckoutAccountGate() {
    setCheckoutError('');
    setCheckoutOpen(false);
    setCartOpen(false);
    setAuthMode('signup');
    setSettingsOpen(true);
    setSettingsActiveTool('account');
    showSettingsError('Create a Darik customer account or log in before checkout. Guest checkout is not available.');

    window.setTimeout(() => {
      scrollSettingsToolIntoView('account');
    }, 180);
  }

  function openCheckoutFromCart() {
    setCheckoutError('');

    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    if (!selectedDeliveryOption) {
      setCheckoutError('Choose Free Next-Day Delivery or Express Delivery before placing the order.');
      return;
    }

    if (authLoading) {
      setCheckoutError('Checking your Darik account. Please try again in a moment.');
      return;
    }

    if (!customerSession?.user || !customerProfile?.id) {
      openCheckoutAccountGate();
      return;
    }

    if (!freeNextDayUnlocked && selectedDeliveryOption === 'next_day_free') {
      setSelectedDeliveryOption('express_2hr');
    }

    setCheckoutOpen(true);
  }

  async function placeWebOrder() {
    setCheckoutError('');

    const cleanName = customerName.trim();
    const cleanPhone = customerPhone.trim();
    const cleanAddress = deliveryAddressDetails.trim();
    const cleanLatitude = Number(manualLatitude);
    const cleanLongitude = Number(manualLongitude);
    const selectedStoredLabel =
      selectedDeliveryOption === 'next_day_free'
        ? 'Free Next-Day Delivery'
        : selectedDeliveryOption === 'express_2hr'
          ? 'Express Delivery'
          : '';

    if (cartItems.length === 0) {
      setCheckoutError('Your cart is empty.');
      return;
    }

    if (!customerSession?.user || !customerProfile?.id) {
      setCheckoutError('Create a Darik customer account or log in before checkout. Guest checkout is not available.');
      openCheckoutAccountGate();
      return;
    }

    if (cleanName.length < 2) {
      setCheckoutError('Type the customer name before placing the order.');
      return;
    }

    if (cleanPhone.length < 7) {
      setCheckoutError('Type the customer phone number before placing the order.');
      return;
    }

    if (!cleanAddress) {
      setCheckoutError('Type the delivery address details before placing the order.');
      return;
    }

    if (!Number.isFinite(cleanLatitude) || !Number.isFinite(cleanLongitude)) {
      setCheckoutError('Enter delivery GPS latitude and longitude.');
      return;
    }

    const cleanDistanceKm = getDistanceKmFromWarehouse(cleanLatitude, cleanLongitude);
    const cleanRadiusWarning = getDeliveryRadiusWarning(cleanDistanceKm, selectedDeliveryOption);

    if (cleanRadiusWarning) {
      setCheckoutError(cleanRadiusWarning);
      return;
    }

    if (selectedDeliveryOption === 'next_day_free' && !freeNextDayUnlocked) {
      setCheckoutError(`Free Next-Day requires ${FREE_NEXT_DAY_MIN_ORDER.toFixed(2)} JOD or more. Choose Express Delivery or add more items.`);
      return;
    }

    if (saveLocationForFuture) {
      const savedLocationOk = await saveCurrentCheckoutLocation();
      if (!savedLocationOk) return;
    }

    const orderItems = cartItems.map((cartItem) => {
      const product = getCheckoutProductForCartItem(cartItem);
      const selectedVariant = getCheckoutVariantForCartItem(cartItem);
      return { cartItem, product, selectedVariant };
    });

    for (const { cartItem, product, selectedVariant } of orderItems) {
      if (!product) {
        setCheckoutError(`Product no longer exists for ${cartItem.name}. Remove it and add it again.`);
        return;
      }

      if (productRequiresSize(product, categoryById) && !cartItem.selectedCartSize) {
        setCheckoutError(`${product.name} needs a selected size before checkout.`);
        return;
      }

      if (cartItem.productVariantId) {
        const stock = Number(selectedVariant?.quantity_in_stock ?? 0);
        if (!selectedVariant || stock < cartItem.quantity) {
          setCheckoutError(`Only ${Math.max(0, stock)} of ${cartItem.name} is available now.`);
          return;
        }
      } else {
        const stock = Number(product.quantity_in_stock ?? 0);
        if (Number.isFinite(stock) && stock < cartItem.quantity) {
          setCheckoutError(`Only ${Math.max(0, stock)} of ${cartItem.name} is available now.`);
          return;
        }
      }
    }

    setPlacingOrder(true);

    try {
      const orderInsertPayload = {
        customer_id: customerProfile.id,
        customer_name: cleanName,
        customer_phone: cleanPhone,
        delivery_latitude: cleanLatitude,
        delivery_longitude: cleanLongitude,
        delivery_address_details: cleanAddress,
        delivery_note: deliveryNote.trim() || null,
        payment_method: 'cash',
        order_status: 'placed',
        payment_status: 'cash_on_delivery',
        payment_verification_status: null,
        subtotal: roundMoney(subtotal),
        delivery_fee: roundMoney(deliveryFee),
        driver_delivery_fee_amount: selectedDeliveryOption === 'express_2hr' ? EXPRESS_DRIVER_DELIVERY_FEE : 0,
        delivery_option: selectedDeliveryOption,
        delivery_label: selectedStoredLabel,
        delivery_eta_label: deliveryEtaLabel,
        assigned_driver_type: selectedDeliveryOption === 'express_2hr' ? 'contractor' : 'company',
        promotion_discount_total: 0,
        retailer_delivery_sponsor_amount: 0,
        promotion_note: null,
        pre_credit_total: roundMoney(total),
        darik_credit_applied_amount: 0,
        customer_amount_due: roundMoney(total),
        total: roundMoney(total),
      };

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(orderInsertPayload)
        .select()
        .single();

      if (orderError) {
        setCheckoutError(orderError.message);
        return;
      }

      const orderItemsPayload = orderItems.map(({ cartItem, product, selectedVariant }) => {
        const customerUnitPrice = cartItem.priceNumber;
        const retailerUnitPrice = getRetailerBasePrice(product);
        const baseRetailerAmount = roundMoney(retailerUnitPrice * cartItem.quantity);
        const customerLineTotal = roundMoney(customerUnitPrice * cartItem.quantity);

        return {
          order_id: orderData.id,
          product_id: product!.id,
          product_variant_id: cartItem.productVariantId ?? null,
          retailer_id: product!.retailer_id,
          product_name: product!.name,
          product_name_ar_snapshot: null,
          product_subcategory_snapshot: product!.subcategory_name ?? null,
          size_label_snapshot: cartItem.selectedCartSize ?? selectedVariant?.size_label ?? null,
          variant_sku_snapshot: cartItem.variantSku ?? selectedVariant?.variant_sku ?? null,
          variant_warehouse_location_snapshot: cartItem.variantWarehouseLocation ?? selectedVariant?.warehouse_location ?? null,
          quantity: cartItem.quantity,
          vendor_price: retailerUnitPrice,
          app_price: customerUnitPrice,
          line_total: customerLineTotal,
          retailer_amount_owed: baseRetailerAmount,
          darik_fulfillment_fee_amount: roundMoney(baseRetailerAmount * DARIK_FULFILLMENT_FEE_RATE),
          darik_markup_amount: roundMoney(Math.max(0, customerLineTotal - baseRetailerAmount)),
        };
      });

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);

      if (itemsError) {
        setCheckoutError(itemsError.message);
        return;
      }

      for (const { cartItem, product, selectedVariant } of orderItems) {
        if (!product) continue;

        if (cartItem.productVariantId && selectedVariant) {
          const decrementResult = await supabase.rpc('customer_decrement_product_variant_stock', {
            p_product_id: product.id,
            p_product_variant_id: cartItem.productVariantId,
            p_quantity: cartItem.quantity,
          });

          if (decrementResult.error) {
            setCheckoutError(`Order created, but size stock warning: ${decrementResult.error.message}`);
          }
        } else {
          await supabase
            .from('products')
            .update({
              quantity_in_stock: Math.max(0, Number(product.quantity_in_stock ?? 0) - cartItem.quantity),
            })
            .eq('id', product.id);
        }
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

      setPlacedOrderPin(deliveryPin);
      setCartItems([]);
      setCheckoutOpen(false);
      setCartOpen(false);
      setOrderPlacedOpen(true);

      setProducts((currentProducts) =>
        currentProducts.map((product) => {
          const orderedQuantity = orderItems
            .filter((line) => line.product?.id === product.id)
            .reduce((sum, line) => sum + line.cartItem.quantity, 0);

          if (orderedQuantity <= 0) return product;

          return {
            ...product,
            quantity_in_stock: Math.max(0, Number(product.quantity_in_stock ?? 0) - orderedQuantity),
          };
        })
      );

      setProductVariants((currentVariants) =>
        currentVariants.map((variant) => {
          const orderedQuantity = orderItems
            .filter((line) => line.cartItem.productVariantId === variant.id)
            .reduce((sum, line) => sum + line.cartItem.quantity, 0);

          if (orderedQuantity <= 0) return variant;

          return {
            ...variant,
            quantity_in_stock: Math.max(0, Number(variant.quantity_in_stock ?? 0) - orderedQuantity),
          };
        })
      );
    } finally {
      setPlacingOrder(false);
    }
  }

  function openProduct(product: Product) {
    setProductImageZoomOpen(false);
    openProductDetail(product);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (loading) {
    return (
      <main className={`darikPage ${selectedCategoryId === 'BestSellers' ? 'featuredTabActive' : ''}`} dir={customerLanguage === 'ar' ? 'rtl' : 'ltr'}>
        <div className="loadingScreen">
          <div className="loadingLogo">
            <img src={LOADING_SCREEN_LOGO} alt="Darik" />
          </div>
          <p>{t('loading')}</p>
          <small className="loadingRecoveryText">If this takes more than a few seconds, Darik will open automatically.</small>
          <button type="button" className="loadingRecoveryButton" onClick={() => window.location.href = '/?reset=1'}>
            Reset Darik browser data
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="darikPage" dir={customerLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <div className="mobileAppWebLayout">
        <header className={`mobileAppHeader ${headerShrunk ? 'shrunk' : ''}`}>
          <button className="mobileIconButton" type="button" onClick={() => setSettingsOpen(true)} aria-label="Settings">
            ☰
          </button>

          <div className="mobileLogoBox">
            <img src={MAIN_SHOPPING_SCREEN_LOGO} alt="Darik Marketplace" />
          </div>

          <button className="mobileCartPill" type="button" onClick={() => setCartOpen(true)} aria-label="Cart">
            🛒
            {cartCount > 0 ? <span>{cartCount}</span> : null}
          </button>
        </header>

        <section className="mobileSearchCard">
          <span>⌕</span>
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onFocus={() => loadCatalogAfterScroll().catch(() => setCatalogDeferredLoading(false))}
            placeholder="Search Darik"
          />
        </section>

        <section className="mobileSponsoredBannerCarousel" aria-label="Darik sponsored store offers">
          <div
            className="mobileSponsoredBannerTrack"
            style={{ transform: `translateX(-${activeBannerIndex * 100}%)` }}
          >
            {visibleAdBanners.map((banner) => (
              <button
                key={banner.id}
                type="button"
                className="mobileSponsoredBannerCard"
                onClick={() => {
                  if (banner.retailer_id) {
                    setSelectedCategoryId('BestSellers');
                  }
                }}
                style={{
                  backgroundColor: banner.background_color || '#111111',
                }}
              >
                <img
                  className="mobileSponsoredBannerImage"
                  src="/darik_under_2_hours_banner1.png"
                  alt="Darik under 2 hours delivery"
                  onError={(event) => {
                    if (banner.banner_image_url) {
                      event.currentTarget.src = banner.banner_image_url;
                    } else {
                      event.currentTarget.style.display = 'none';
                    }
                  }}
                />

                <span className="mobileSponsoredBannerCta">
                  {banner.cta_label || 'CLICK TO SHOP'}
                </span>
              </button>
            ))}
          </div>

          {visibleAdBanners.length > 1 ? (
            <div className="mobileSponsoredBannerDots" aria-label="Sponsored offer slides">
              {visibleAdBanners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  className={index === activeBannerIndex ? 'active' : ''}
                  onClick={() => setActiveBannerIndex(index)}
                  aria-label={`Show sponsored offer ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </section>

        <button className="mobileCartSummaryCard" type="button" onClick={() => setCartOpen(true)}>
          <div>
            <strong>{cartCount > 0 ? `${cartCount} item${cartCount === 1 ? '' : 's'} in cart` : 'Your Darik cart'}</strong>
            <span>{cartCount > 0 ? 'Tap to review checkout' : 'Start shopping essentials around Amman'}</span>
          </div>
          <b>{money(subtotal)} JOD</b>
        </button>

        <section className="mobileSection">
          <div className="mobileSectionTitleRow">
            <h2>Categories</h2>
          </div>

          <div className="mobileCategoryScroller">
            <button
              type="button"
              className={`mobileCategoryChip ${selectedCategoryId === 'BestSellers' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategoryId('BestSellers');
                setSelectedDepartmentCode('All');
                setSelectedSubcategoryCode('All');
                loadCatalogAfterScroll().catch(() => setCatalogDeferredLoading(false));
              }}
            >
              <span>★</span>
              <strong>Featured</strong>
            </button>

            {visibleCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`mobileCategoryChip ${selectedCategoryId === category.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  loadCatalogAfterScroll().catch(() => setCatalogDeferredLoading(false));
                }}
              >
                <span className="mobileCategoryImage">
                  {getCategoryPreviewImageUrl(category.name) ? (
                    <img
                      src={getCategoryPreviewImageUrl(category.name)!}
                      alt={category.name}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    getCategoryEmoji(category.name)
                  )}
                </span>
                <strong>{category.name}</strong>
              </button>
            ))}
          </div>
        </section>

        {!catalogLoaded && catalogDeferredLoading ? (
          <section className="mobileLoadingMarketplace" aria-live="polite">
            <span>Loading marketplace</span>
            <b className="loadingDots">
              <i>.</i>
              <i>.</i>
              <i>.</i>
            </b>
          </section>
        ) : null}

        {catalogLoaded ? (
          <>
            {selectedCategoryId !== 'BestSellers' && selectedCategoryHasSubcategories ? (
              <section className="mobileSubcategoryPanel">
                <h3>Subcategories</h3>

                {selectedCategoryHasMultipleDepartments ? (
                  <div className="mobileSubcategoryScroller">
                    <button
                      type="button"
                      className={`mobileSubcategoryChip ${selectedDepartmentCode === 'All' ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedDepartmentCode('All');
                        setSelectedSubcategoryCode('All');
                      }}
                    >
                      All
                    </button>

                    {selectedCategoryDepartmentOptions.map((department) => (
                      <button
                        key={department.id}
                        type="button"
                        className={`mobileSubcategoryChip ${selectedDepartmentCode === department.id ? 'active' : ''}`}
                        onClick={() => setSelectedDepartmentCode(department.id)}
                      >
                        {department.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mobileSubcategoryScroller">
                  <button
                    type="button"
                    className={`mobileSubcategoryChip ${selectedSubcategoryCode === 'All' ? 'active' : ''}`}
                    onClick={() => setSelectedSubcategoryCode('All')}
                  >
                    All items
                  </button>

                  {selectedCategoryItemTypeOptions.map((itemType) => (
                    <button
                      key={itemType.id}
                      type="button"
                      className={`mobileSubcategoryChip ${selectedSubcategoryCode === itemType.id ? 'active' : ''}`}
                      onClick={() => setSelectedSubcategoryCode(itemType.id)}
                    >
                      {itemType.label}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}

            {selectedCategoryId === 'BestSellers' ? (
              <section className="mobileSection">
                <div className="mobileSectionTitleRow">
                  <h2>Featured items</h2>
                </div>

                <div className="mobileFeaturedStack">
                  {visibleFeaturedDepartmentsToRender.map((department) => {
                    const departmentProducts = getBestSellerDepartmentProducts(department.id);
                    const featuredProductPage = getFeaturedProductPage(department.id);
                    const firstProductIndex = featuredProductPage * FEATURED_PRODUCTS_PER_PAGE;
                    const visibleDepartmentProducts = departmentProducts.slice(
                      firstProductIndex,
                      firstProductIndex + FEATURED_PRODUCTS_PER_PAGE
                    );
                    const canShowPreviousProducts = featuredProductPage > 0;
                    const canShowMoreProducts =
                      firstProductIndex + FEATURED_PRODUCTS_PER_PAGE <
                      Math.max(departmentProducts.length, loadedProductCategoryLimitRef.current[department.id] ?? 0);

                    if (departmentProducts.length === 0) return null;

                    return (
                      <section key={department.id} className="mobileFeaturedDepartment">
                        <h3>Best Sellers in {department.name}</h3>

                        <div className="mobileProductRow">
                          {canShowPreviousProducts ? (
                            <button
                              type="button"
                              className="mobileMoreCircle previous"
                              onClick={() => showPreviousFeaturedProducts(department.id)}
                            >
                              ‹
                              <small>Previous</small>
                            </button>
                          ) : null}

                          {visibleDepartmentProducts.map((product) => {
                            const photoUrl = getProductPhotoUrl(product);

                            return (
                              <button
                                key={product.id}
                                type="button"
                                className="mobileProductCard"
                                onClick={() => openProductDetail(product)}
                              >
                                <span className="mobileProductImageBox">
                                  {photoUrl ? (
                                    <img src={photoUrl} alt={product.name} />
                                  ) : (
                                    <b>{shortCode(product.name)}</b>
                                  )}
                                </span>
                                <strong>{product.name}</strong>
                                <em>{money(getCustomerPrice(product))} JOD</em>
                              </button>
                            );
                          })}

                          {canShowMoreProducts ? (
                            <button
                              type="button"
                              className="mobileMoreCircle"
                              onClick={() => showNextFeaturedProducts(department.id, departmentProducts.length)}
                            >
                              ›
                              <small>More</small>
                            </button>
                          ) : null}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </section>
            ) : (
              <section className="mobileSection">
                <div className="mobileSectionTitleRow">
                  <h2>{selectedCategoryName || 'Products'}</h2>
                  <span>{Math.min(visibleCategoryProductCount, filteredProducts.length)} of {filteredProducts.length}</span>
                </div>

                {visibleCategoryProducts.length === 0 ? (
                  <div className="mobileEmptyCard">
                    <strong>No products found</strong>
                    <p>Try a different category or search.</p>
                  </div>
                ) : (
                  <div className="mobileProductGrid categoryProductsGrid">
                    {visibleCategoryProducts.map((product) => {
                      const photoUrl = getProductPhotoUrl(product);

                      return (
                        <article key={product.id} className="mobileGridProductCard">
                          <button type="button" className="mobileGridImageButton" onClick={() => openProductDetail(product)}>
                            {photoUrl ? (
                              <img src={photoUrl} alt={product.name} />
                            ) : (
                              <b>{shortCode(product.name)}</b>
                            )}
                          </button>

                          <button type="button" className="mobileGridInfoButton" onClick={() => openProductDetail(product)}>
                            <strong>{product.name}</strong>
                            <span>{money(getCustomerPrice(product))} JOD</span>
                          </button>

                          <button type="button" className="mobileAddButton" onClick={() => addToCart(product)}>
                            Add
                          </button>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            )}
          </>
        ) : null}
      </div>

      <div className="webAppShell desktopWebLayout">
        <header className={`topHeader ${headerShrunk ? 'topHeaderShrunk' : ''}`}>
          <button className="circleButton settingsHeaderButton" type="button" onClick={() => setSettingsOpen(true)} aria-label="Settings">
            ⚙
          </button>

          <div className="logoWrap">
            <img src={MAIN_SHOPPING_SCREEN_LOGO} alt="Darik Marketplace" />
          </div>

          <button className="circleButton cartButton" type="button" onClick={() => setCartOpen(true)} aria-label="Cart">
            🛒
            <span>{cartCount}</span>
          </button>
        </header>

        <section className="searchBar">
          <span>⌕</span>
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search products..."
          />
        </section>

        <section className="sponsoredBannerCarousel" aria-label="Darik store offers">
          <div
            className="sponsoredBannerTrack"
            style={{ transform: `translateX(-${activeBannerIndex * 100}%)` }}
          >
            {visibleAdBanners.map((banner) => (
              <button
                key={banner.id}
                type="button"
                className="sponsoredBannerCard"
                onClick={() => {
                  if (banner.retailer_id) setSelectedCategoryId('All');
                }}
                style={{
                  backgroundColor: banner.background_color || '#111111',
                }}
              >
                {banner.banner_image_url ? (
                  <img
                    className="sponsoredBannerImage"
                    src={banner.banner_image_url}
                    alt={banner.headline || banner.sponsor_name || 'Darik offer'}
                  />
                ) : (
                  <div className="sponsoredBannerFallback">
                    <img src={MAIN_SHOPPING_SCREEN_LOGO} alt="Darik" />
                    <h2>{banner.headline || 'Darik Marketplace'}</h2>
                    <p>{banner.subheadline || 'Essentials delivered fast around Amman.'}</p>
                  </div>
                )}

                <span className="sponsoredBannerCta">
                  {banner.cta_label || 'CLICK TO SHOP'}
                </span>
              </button>
            ))}
          </div>

          {visibleAdBanners.length > 1 ? (
            <div className="sponsoredBannerDots">
              {visibleAdBanners.map((banner, index) => (
                <button
                  key={`${banner.id}-dot`}
                  type="button"
                  className={index === activeBannerIndex ? 'active' : ''}
                  onClick={() => setActiveBannerIndex(index)}
                  aria-label={`Go to offer ${index + 1}`}
                />
              ))}
            </div>
          ) : null}
        </section>

        <section className="trustGrid">
          <div className="trustCard">
            <div className="trustIcon">🚚</div>
            <div>
              <h3>Free Next Day</h3>
              <p>No-cost tomorrow delivery</p>
            </div>
          </div>

          <div className="trustCard">
            <div className="trustIcon">⏱</div>
            <div>
              <h3>Express Delivery</h3>
              <p>Delivery in under 2 hours</p>
            </div>
          </div>

          <div className="trustCard">
            <div className="trustIcon">🛡</div>
            <div>
              <h3>Secure Payment</h3>
              <p>Safe & encrypted</p>
            </div>
          </div>

          <div className="trustCard">
            <div className="trustIcon">🏅</div>
            <div>
              <h3>Darik Promise</h3>
              <p>Trusted Darik protection</p>
            </div>
          </div>
        </section>

        {cartCount > 0 ? (
          <button className="cartSummary" type="button" onClick={() => setCartOpen(true)}>
            <div>
              <h3>Cart Summary</h3>
              <p>{cartCount} item{cartCount === 1 ? '' : 's'} added</p>
            </div>
            <div>
              <strong>{money(total)} JOD</strong>
              <span>Tap to view cart</span>
            </div>
          </button>
        ) : null}

        <section className="sectionBlock categoriesTightAfterCart">
          <div className="sectionTitleRow">
            <h2>Categories</h2>
          </div>

          <div className="categoryRow">
            <button
              type="button"
              className={`categoryButton ${selectedCategoryId === 'BestSellers' ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategoryId('BestSellers');
                setSelectedDepartmentCode('All');
                setSelectedSubcategoryCode('All');
                loadCatalogAfterScroll().catch(() => setCatalogDeferredLoading(false));
              }}
            >
              <span className="categoryCircle best">★</span>
              <strong>Featured</strong>
            </button>

            {visibleCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`categoryButton ${selectedCategoryId === category.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedCategoryId(category.id);
                  loadCatalogAfterScroll().catch(() => setCatalogDeferredLoading(false));
                }}
              >
                <span className="categoryCircle imageCategoryCircle">
                  {getCategoryPreviewImageUrl(category.name) ? (
                    <img
                      src={getCategoryPreviewImageUrl(category.name)!}
                      alt={category.name}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    getCategoryEmoji(category.name)
                  )}
                </span>
                <strong>{category.name}</strong>
              </button>
            ))}
          </div>
        </section>

        {!catalogLoaded && catalogDeferredLoading ? (
          <section className="deferredCatalogLoadingInline" aria-live="polite">
            <span>Loading marketplace</span>
            <span className="loadingDots">
              <i>.</i>
              <i>.</i>
              <i>.</i>
            </span>
          </section>
        ) : null}

        {catalogLoaded ? (
          <>
        {selectedCategoryId !== 'BestSellers' && selectedCategoryHasSubcategories ? (
          <section className="subcategoryFilterBlock">
            <div className="subcategoryTitleRow">
              <div>
                <h3>Subcategories</h3>
                <p>Narrow {selectedCategoryName || 'this category'} by exact item type</p>
              </div>
            </div>

            {selectedCategoryHasMultipleDepartments ? (
              <div className="subcategoryChipRow">
                <button
                  type="button"
                  className={`subcategoryChip ${selectedDepartmentCode === 'All' ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedDepartmentCode('All');
                    setSelectedSubcategoryCode('All');
                  }}
                >
                  All
                </button>

                {selectedCategoryDepartmentOptions.map((department) => (
                  <button
                    key={department.id}
                    type="button"
                    className={`subcategoryChip ${selectedDepartmentCode === department.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedDepartmentCode(department.id);
                      setSelectedSubcategoryCode('All');
                    }}
                  >
                    {department.label}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="subcategoryChipRow">
              <button
                type="button"
                className={`subcategoryChip ${selectedSubcategoryCode === 'All' ? 'active' : ''}`}
                onClick={() => {
                  setSelectedDepartmentCode('All');
                  setSelectedSubcategoryCode('All');
                }}
              >
                All Items
              </button>

              {selectedCategoryItemTypeOptions.map((itemType) => (
                <button
                  key={itemType.id}
                  type="button"
                  className={`subcategoryChip ${selectedSubcategoryCode === itemType.id ? 'active' : ''}`}
                  onClick={() => {
                    if (selectedDepartmentCode === 'All' && itemType.departmentCode) {
                      setSelectedDepartmentCode(itemType.departmentCode);
                    }
                    setSelectedSubcategoryCode(itemType.id);
                  }}
                >
                  {itemType.label}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className={`sectionBlock ${selectedCategoryId === 'BestSellers' ? 'featuredItemsTightSection' : ''}`}>
          <div className="sectionTitleRow">
            <div>
              <h2>{selectedCategoryId === 'BestSellers' ? 'Best Sellers' : 'Products'}</h2>
              <p>Verified stock ready for delivery</p>
            </div>
            <span>
              {selectedCategoryId === 'BestSellers'
                ? `${filteredProducts.length} items`
                : `Showing ${Math.min(visibleCategoryProductCount, filteredProducts.length)} of ${filteredProducts.length} items`}
            </span>
          </div>

          {selectedCategoryId === 'BestSellers' ? (
            visibleBestSellerDepartments.length === 0 ? (
              <div className="emptyCard">
                <h3>No best sellers found</h3>
                <p>Once live products start selling, they will appear here by department.</p>
              </div>
            ) : (
              <div className="bestSellerDepartmentStack">
                {visibleFeaturedDepartmentsToRender.map((department) => {
                  const departmentProducts = getBestSellerDepartmentProducts(department.id);
                  const featuredProductPage = getFeaturedProductPage(department.id);
                  const firstProductIndex = featuredProductPage * FEATURED_PRODUCTS_PER_PAGE;
                  const visibleDepartmentProducts = departmentProducts.slice(
                    firstProductIndex,
                    firstProductIndex + FEATURED_PRODUCTS_PER_PAGE
                  );
                  const canShowPreviousProducts = featuredProductPage > 0;
                  const canShowMoreProducts = firstProductIndex + FEATURED_PRODUCTS_PER_PAGE < Math.max(departmentProducts.length, loadedProductCategoryLimitRef.current[department.id] ?? 0);

                  if (departmentProducts.length === 0) return null;

                  return (
                    <section key={department.id} className="bestSellerDepartmentSection">
                      <h3 className="bestSellerDepartmentTitle">
                        Best Sellers in {department.name} →
                      </h3>

                      <div className="bestSellerCarousel">
                        {canShowPreviousProducts ? (
                          <button
                            type="button"
                            className="bestSellerInlinePagingCircle previous"
                            onClick={() => showPreviousFeaturedProducts(department.id)}
                          >
                            <span>‹</span>
                            <strong>See previous</strong>
                          </button>
                        ) : null}

                        {visibleDepartmentProducts.map((product) => {
                          const photoUrl = getProductPhotoUrl(product);

                          return (
                            <button
                              key={product.id}
                              type="button"
                              className="bestSellerCleanItem"
                              onClick={() => openProduct(product)}
                            >
                              <div className="bestSellerCleanImageWrap">
                                {photoUrl ? (
                                  <img className="bestSellerCleanImage" src={photoUrl} alt={product.name} />
                                ) : (
                                  <div className="bestSellerCleanPlaceholder">
                                    <span>{shortCode(product.name)}</span>
                                  </div>
                                )}

                                {product.product_free_delivery_enabled ? (
                                  <span className="bestSellerCleanFreeBadge">FREE</span>
                                ) : null}
                              </div>

                              <h4>{product.name}</h4>
                              <strong>{money(getCustomerPrice(product))} JOD</strong>
                            </button>
                          );
                        })}

                        {canShowMoreProducts ? (
                          <button
                            type="button"
                            className="bestSellerInlinePagingCircle next"
                            onClick={() => showNextFeaturedProducts(department.id, departmentProducts.length)}
                          >
                            <span>›</span>
                            <strong>See more</strong>
                          </button>
                        ) : null}
                      </div>
                    </section>
                  );
                })}
              </div>
            )
          ) : filteredProducts.length === 0 ? (
            <div className="emptyCard">
              <h3>No live products found</h3>
              <p>Add or approve products from the retailer/admin apps.</p>
            </div>
          ) : (
            <div className="productGrid categoryProductsGrid">
              {visibleCategoryProducts.map((product) => {
                const photoUrl = getProductPhotoUrl(product);
                const categoryName =
                  product.category_id
                    ? categoryById.get(product.category_id)?.name ?? product.category_name ?? 'Category'
                    : product.category_name ?? 'Category';
                const productSubcategoryLabel = stripSubcategoryLeaf(product.subcategory_name);

                return (
                  <article key={product.id} className="productCard" onClick={() => openProduct(product)}>
                    <div className="productImageWrap">
                      {photoUrl ? (
                        <img src={photoUrl} alt={product.name} />
                      ) : (
                        <div className="productInitials">{shortCode(product.name)}</div>
                      )}

                      {product.product_free_delivery_enabled ? (
                        <span className="freeBadge">FREE</span>
                      ) : null}
                    </div>

                    <div className="productInfo">
                      <div>
                        <h3>{product.name}</h3>
                        <p>{productSubcategoryLabel ? `${categoryName} • ${productSubcategoryLabel}` : `${categoryName} ✓`}</p>
                      </div>

                      <div className="productBottom">
                        <div>
                          <strong>{money(getCustomerPrice(product))} JOD</strong>
                          <span>🚚 Free Next-Day</span>
                        </div>

                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            if (productRequiresSize(product, categoryById)) {
                              const variantsForProduct = getVariantsForProduct(product);

                              if (variantsForProduct.length !== 1) {
                                openProductDetail(product);
                                setSelectedClothingSize('');
                                setSelectedClothingVariantId('');
                                return;
                              }

                              addToCart(product, variantsForProduct[0].size_label, variantsForProduct[0]);
                              return;
                            }

                            addToCart(product);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
          </>
        ) : null}

        {catalogLoaded ? (
        <section className="operationsPromise">
          <span>DARIK OPERATIONS PROMISE</span>
          <h2>Essentials delivered with warehouse-level control.</h2>
          <p>Every live item is tied to stock, routing, driver dispatch, and order history.</p>
        </section>
        ) : null}
      </div>

      {selectedProduct ? (
        <section className="productFullScreenOverlay" aria-label="Product details">
          <div className="productFullScreenPage">
            {(() => {
              const detailRequiresSize = productRequiresSize(selectedProduct, categoryById);
              const detailVariantOptions = getVariantsForProduct(selectedProduct);
              const detailSizeOptions = getProductSizeOptions(selectedProduct, detailVariantOptions);
              const detailSingleSize = getProductSingleSize(selectedProduct);
              const detailSelectedVariant = getSelectedVariantForProduct(
                selectedProduct,
                selectedClothingVariantId,
                selectedClothingSize
              );
              const detailFinalSelectedSize =
                detailSelectedVariant?.size_label ||
                selectedClothingSize ||
                (detailSizeOptions.length === 1 ? detailSizeOptions[0] : detailSingleSize);
              const detailPhotoUrl = getProductPhotoUrl(selectedProduct);
              const detailCategoryName = selectedProduct.category_id
                ? categoryById.get(selectedProduct.category_id)?.name ?? selectedProduct.category_name ?? 'Category'
                : selectedProduct.category_name ?? 'Category';
              const detailSubcategoryLabel = stripSubcategoryLeaf(selectedProduct.subcategory_name);

              return (
                <>
                  <div className="darikPdpHeader">
                    <button
                      className="darikPdpBackButton"
                      type="button"
                      onClick={returnToShoppingFromProduct}
                    >
                      ← Back to shopping
                    </button>

                    <div className="darikPdpHeaderBrand">
                      <strong>Darik</strong>
                      <span>Marketplace</span>
                    </div>

                    <button className="darikPdpCartButton" type="button" onClick={() => setCartOpen(true)}>
                      Cart ({cartCount})
                    </button>
                  </div>

                  <div className="darikPdpFrame">
                    <div className="darikPdpBreadcrumbs">
                      <span>Home</span>
                      <span>›</span>
                      <span>{detailCategoryName}</span>
                      {detailSubcategoryLabel ? (
                        <>
                          <span>›</span>
                          <span>{detailSubcategoryLabel}</span>
                        </>
                      ) : null}
                    </div>

                    <div className="darikPdpGrid">
                      <div className="darikPdpMediaColumn">
                        <div className="darikPdpThumbRail" aria-hidden="true">
                          {[1, 2, 3, 4].map((thumbIndex) => (
                            <div key={thumbIndex} className={'darikPdpThumb ' + (thumbIndex === 1 ? 'active' : '')}>
                              {detailPhotoUrl ? (
                                <img src={detailPhotoUrl} alt={selectedProduct.name + ' thumbnail ' + thumbIndex} />
                              ) : (
                                <span>{shortCode(selectedProduct.name)}</span>
                              )}
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          className={'darikPdpImageStage ' + (detailPhotoUrl ? 'isClickable' : '')}
                          onClick={() => {
                            if (detailPhotoUrl) setProductImageZoomOpen(true);
                          }}
                          disabled={!detailPhotoUrl}
                          aria-label="Open larger product image"
                        >
                          {detailPhotoUrl ? (
                            <img src={detailPhotoUrl} alt={selectedProduct.name} />
                          ) : (
                            <div className="productInitials big">{shortCode(selectedProduct.name)}</div>
                          )}

                          {selectedProduct.product_free_delivery_enabled ? (
                            <span className="darikPdpFreeBadge">FREE NEXT-DAY</span>
                          ) : null}

                          <span className="darikPdpZoomHint">Click image to zoom</span>
                        </button>
                      </div>

                      <div className="darikPdpInfoColumn">
                        <div className="darikPdpBrandLabel">Darik Marketplace</div>
                        <h1 className="darikPdpTitle">{selectedProduct.name}</h1>

                        <div className="darikPdpMetaRow">
                          <span>{detailCategoryName}{detailSubcategoryLabel ? ' • ' + detailSubcategoryLabel : ''}</span>
                        </div>

                        <div className="darikPdpRatingRow">
                          <strong>4.6</strong>
                          <span className="darikPdpStars">★★★★★</span>
                          <span>(128 reviews)</span>
                        </div>

                        <div className="darikPdpPrice">{money(getCustomerPrice(selectedProduct))} JOD</div>
                        <div className="darikPdpVatNote">All prices include VAT</div>

                        <div className="darikPdpTrustStrip">
                          <span>Secure payment</span>
                          <span>Easy returns</span>
                          <span>Buyer protection</span>
                        </div>

                        {detailRequiresSize ? (
                          <div className="darikPdpSizeBlock">
                            <div className="darikPdpSectionTitleRow">
                              <strong>Size:</strong>
                              <span>{detailFinalSelectedSize ? detailFinalSelectedSize : 'Please select'}</span>
                            </div>
                            {detailSizeOptions.length > 0 ? (
                              <div className="darikPdpSizeRow">
                                {(detailVariantOptions.length > 0
                                  ? detailVariantOptions
                                  : detailSizeOptions.map((size) => ({ id: size, size_label: size, quantity_in_stock: 1 } as ProductVariant))
                                ).map((variant) => {
                                  const size = variant.size_label;
                                  const isActive = detailSelectedVariant
                                    ? detailSelectedVariant.id === variant.id
                                    : detailFinalSelectedSize === size;

                                  return (
                                    <button
                                      key={variant.id}
                                      type="button"
                                      className={'darikPdpSizeChip ' + (isActive ? 'active' : '')}
                                      onClick={() => {
                                        setSelectedClothingSize(size);
                                        setSelectedClothingVariantId(variant.id);
                                      }}
                                    >
                                      {size}
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <p className="darikPdpMuted">No active size inventory was found for this product in product_variants.</p>
                            )}
                            <button type="button" className="darikPdpSizeGuideButton">Size guide</button>
                          </div>
                        ) : null}

                        <div className="darikPdpAccordionGroup">
                          <details className="darikPdpAccordion" open>
                            <summary>Product highlights</summary>
                            <ul>
                              <li>Warehouse-stocked item with live inventory control</li>
                              <li>Fast Darik delivery across Amman</li>
                              <li>Support handled directly by Darik</li>
                              <li>Sizes shown reflect available stock</li>
                            </ul>
                          </details>

                          <details className="darikPdpAccordion">
                            <summary>Product details</summary>
                            <p>{selectedProduct.description || 'This item is listed on Darik Marketplace and delivered through Darik operations.'}</p>
                          </details>

                          <details className="darikPdpAccordion">
                            <summary>Materials & care</summary>
                            <ul>
                              <li>Follow the care instructions provided by the retailer when available</li>
                              <li>Store in a cool, dry place</li>
                              <li>Contact support if you need product-specific care help</li>
                            </ul>
                          </details>

                          <details className="darikPdpAccordion">
                            <summary>Measurements</summary>
                            <p>Use the size selector above. If you need help choosing the right fit, contact Darik support before ordering.</p>
                          </details>
                        </div>
                      </div>

                      <aside className="darikPdpBuyBox">
                        <div className="darikPdpBuyBoxTop">
                          <span>Buy this item</span>
                          <strong>{money(getCustomerPrice(selectedProduct))} JOD</strong>
                        </div>

                        <div className="darikPdpShipCard">
                          <div className="darikPdpShipLine"><strong>Free delivery to Amman</strong></div>
                          <div className="darikPdpShipLine">Tomorrow, May 20</div>
                          <div className="darikPdpShipLine darikPdpShipAccent">Order within 5 hrs 17 mins</div>
                        </div>

                        <div className="darikPdpLocationRow">
                          <span>Deliver to Jordan</span>
                          <button type="button" onClick={() => { setSettingsOpen(true); setSettingsActiveTool('locations'); }}>Change</button>
                        </div>

                        <button
                          type="button"
                          className="darikPdpPrimaryButton"
                          disabled={detailRequiresSize && !detailFinalSelectedSize}
                          onClick={() => {
                            if (detailRequiresSize && !detailFinalSelectedSize) return;
                            addToCart(selectedProduct, detailFinalSelectedSize, detailSelectedVariant);
                          }}
                        >
                          {detailRequiresSize && !detailFinalSelectedSize ? 'Choose Size' : 'Add to Cart'}
                        </button>

                        <button
                          type="button"
                          className="darikPdpSecondaryButton"
                          disabled={detailRequiresSize && !detailFinalSelectedSize}
                          onClick={() => {
                            if (detailRequiresSize && !detailFinalSelectedSize) return;
                            addToCart(selectedProduct, detailFinalSelectedSize, detailSelectedVariant);
                            setSelectedProduct(null);
                            setSelectedClothingSize('');
                            setSelectedClothingVariantId('');
                            setProductImageZoomOpen(false);
                            setCartOpen(true);
                          }}
                        >
                          Buy Now
                        </button>

                        <button type="button" className="darikPdpTertiaryButton" onClick={() => setSettingsOpen(true)}>
                          Add to Wishlist
                        </button>

                        <div className="darikPdpSellerCard">
                          <span>Sold by</span>
                          <strong>Darik Seller</strong>
                          <p>98% positive (2,340)</p>
                          <button type="button" onClick={() => { setSettingsOpen(true); setSettingsActiveTool('support'); }}>Contact seller</button>
                        </div>
                      </aside>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </section>
      ) : null}

      {selectedProduct && productImageZoomOpen && getProductPhotoUrl(selectedProduct) ? (
        <div className="productImageZoomOverlay" onClick={() => setProductImageZoomOpen(false)}>
          <div className="productImageZoomShell" onClick={(event) => event.stopPropagation()}>
            <button className="productImageZoomClose" type="button" onClick={() => setProductImageZoomOpen(false)}>
              Close
            </button>
            <img src={getProductPhotoUrl(selectedProduct)!} alt={selectedProduct.name} />
          </div>
        </div>
      ) : null}

      {settingsOpen ? (
        <div className="settingsFullScreenOverlay" dir={customerLanguage === 'ar' ? 'rtl' : 'ltr'}>
          <div className="settingsFullScreenPage">
            <div className="settingsTopBar">
              <button type="button" className="checkoutBackButton" onClick={() => setSettingsOpen(false)}>
                ← {t('back')}
              </button>

              <div>
                <h2>{t('settings')}</h2>
                <p>{t('menuSubtitle')}</p>
              </div>

              <button type="button" className="settingsSaveTopButton" onClick={() => saveCustomerSettingsFromPanel().catch(() => {})}>
                {t('saveSettings')}
              </button>
            </div>

            {settingsSavedMessage ? <div className="settingsSavedMessage">{settingsSavedMessage}</div> : null}
            {settingsError ? <div className="checkoutErrorBox">{settingsError}</div> : null}

            <div className="settingsGrid">
              <section
                ref={(node) => {
                  settingsSectionRefs.current.account = node;
                }}
                className={`settingsPanel accountSettingsPanel${getHighlightedSettingsClass('account')}`}
              >
                <div className="settingsPanelHeader">
                  <span>👤</span>
                  <div>
                    <h3>{t('accountInformation')}</h3>
                    <p>{customerSession ? t('settingsSubtitle') : t('loginRequiredText')}</p>
                  </div>
                </div>

                {customerSession ? (
                  <>
                    <div className="settingsAccountCard">
                      <span>{t('signedInAs')}</span>
                      <strong>{customerProfile?.full_name || customerName || customerSession.user.email || t('guestCustomer')}</strong>
                      <p>{customerProfile?.email || customerSession.user.email}</p>
                      {customerNumber ? <small>{t('customerNumber')}: {customerNumber}</small> : null}
                    </div>

                    <div className="settingsTwoColumn">
                      <label>
                        {t('fullName')}
                        <input
                          value={customerName}
                          onChange={(event) => setCustomerName(event.target.value)}
                          placeholder="Example: Ahmad Saleh"
                        />
                      </label>

                      <label>
                        {t('phoneNumber')}
                        <input
                          value={customerPhone}
                          onChange={(event) => setCustomerPhone(event.target.value)}
                          placeholder="Example: 0790000000"
                        />
                      </label>
                    </div>

                    <label>
                      {t('email')}
                      <input
                        value={customerEmail}
                        onChange={(event) => setCustomerEmail(event.target.value)}
                        placeholder="customer@example.com"
                      />
                    </label>

                    <div className="settingsMiniStats">
                      <div>
                        <span>{t('customerNumber')}</span>
                        <strong>{customerNumber || '—'}</strong>
                      </div>
                      <div>
                        <span>{t('darikCreditBalance')}</span>
                        <strong>{money(customerProfile?.darik_credit_balance ?? 0)} JOD</strong>
                      </div>
                    </div>

                    <div className="settingsButtonRow">
                      <button type="button" className="settingsPrimaryButton" onClick={() => saveCustomerSettingsFromPanel().catch(() => {})}>
                        {t('saveSettings')}
                      </button>
                      <button type="button" className="settingsSecondaryButton" onClick={() => handleWebCustomerLogout().catch(() => {})}>
                        {t('logout')}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="settingsAuthBox">
                    <div className="settingsAuthSwitch">
                      <button type="button" className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>
                        {t('login')}
                      </button>
                      <button type="button" className={authMode === 'signup' ? 'active' : ''} onClick={() => setAuthMode('signup')}>
                        {t('signUp')}
                      </button>
                    </div>

                    {authMode === 'login' ? (
                      <div className="settingsAuthForm">
                        <h4>{t('customerLogin')}</h4>
                        <label>
                          {t('email')}
                          <input value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} placeholder="customer@example.com" />
                        </label>
                        <label>
                          {t('password')}
                          <input type="password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} placeholder={t('password')} />
                        </label>
                        <p>{t('rememberPasswordNote')}</p>
                        <button type="button" className="settingsPrimaryButton" disabled={authBusy || authLoading} onClick={() => handleWebCustomerLogin().catch(() => {})}>
                          {authBusy || authLoading ? t('pleaseWait') : t('login')}
                        </button>
                      </div>
                    ) : (
                      <div className="settingsAuthForm">
                        <h4>{t('createCustomerAccount')}</h4>
                        <label>
                          {t('fullName')}
                          <input value={signupName} onChange={(event) => setSignupName(event.target.value)} placeholder="Example: Ahmad Saleh" />
                        </label>
                        <label>
                          {t('phoneNumber')}
                          <input value={signupPhone} onChange={(event) => setSignupPhone(event.target.value)} placeholder="Example: 0790000000" />
                        </label>
                        <label>
                          {t('email')}
                          <input value={signupEmail} onChange={(event) => setSignupEmail(event.target.value)} placeholder="customer@example.com" />
                        </label>
                        <label>
                          {t('password')}
                          <input type="password" value={signupPassword} onChange={(event) => setSignupPassword(event.target.value)} placeholder="Minimum 6 characters" />
                        </label>
                        <button type="button" className="settingsPrimaryButton" disabled={authBusy || authLoading} onClick={() => handleWebCustomerSignup().catch(() => {})}>
                          {authBusy || authLoading ? t('pleaseWait') : t('signUp')}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>

              <section className="settingsPanel">
                <div className="settingsPanelHeader">
                  <span>⚙</span>
                  <div>
                    <h3>{t('otherOptions')}</h3>
                    <p>{t('menuSubtitle')}</p>
                  </div>
                </div>

                <div className="settingsOptionCard">
                  <div>
                    <strong>{t('changeLanguage')}</strong>
                    <p>{t('currentLanguage')}: {customerLanguage === 'en' ? t('english') : t('arabic')}</p>
                  </div>

                  <div className="languageToggle">
                    <button
                      type="button"
                      className={customerLanguage === 'en' ? 'active' : ''}
                      onClick={() => changeCustomerLanguage('en').catch(() => {})}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      className={customerLanguage === 'ar' ? 'active' : ''}
                      onClick={() => changeCustomerLanguage('ar').catch(() => {})}
                    >
                      العربية
                    </button>
                  </div>
                </div>

                <button type="button" className={`settingsOptionButton ${settingsActiveTool === 'orders' ? 'active' : ''}`} onClick={() => openCustomerOrderHistoryFromMenu().catch(() => {})}>
                  <span>📦</span>
                  <div>
                    <strong>{t('seeOrderHistory')}</strong>
                    <p>{customerSession ? 'View your Darik orders from the same account used in the app.' : t('loginRequiredText')}</p>
                  </div>
                </button>

                <button type="button" className={`settingsOptionButton ${settingsActiveTool === 'support' ? 'active' : ''}`} onClick={() => openCustomerSupportFromMenu().catch(() => {})}>
                  <span>💬</span>
                  <div>
                    <strong>{t('contactSupport')}</strong>
                    <p>{customerSession ? 'Create support tickets and reply to Darik admin.' : t('loginRequiredText')}</p>
                  </div>
                </button>

                <button type="button" className={`settingsOptionButton ${settingsActiveTool === 'password' ? 'active' : ''}`} onClick={openCustomerChangePasswordFromMenu}>
                  <span>🔐</span>
                  <div>
                    <strong>{t('changeYourPassword')}</strong>
                    <p>{t('passwordChangeHelp')}</p>
                  </div>
                </button>

                <button type="button" className={`settingsOptionButton ${settingsActiveTool === 'locations' ? 'active' : ''}`} onClick={() => openSettingsTool('locations')}>
                  <span>📍</span>
                  <div>
                    <strong>{t('savedLocations')}</strong>
                    <p>{t('savedLocationsText')}</p>
                  </div>
                </button>

                <button type="button" className="settingsDangerButton" onClick={() => clearWebCustomerSettings().catch(() => {})}>
                  {customerSession ? t('logout') : 'Clear Web Customer Settings'}
                </button>
              </section>

              <section
                ref={(node) => {
                  settingsSectionRefs.current.locations = node;
                }}
                className={`settingsPanel savedLocationsSettingsPanel${getHighlightedSettingsClass('locations')}`}
              >
                <div className="settingsPanelHeader">
                  <span>📍</span>
                  <div>
                    <h3>{t('savedLocations')}</h3>
                    <p>{t('savedLocationsText')}</p>
                  </div>
                </div>

                {savedLocations.length === 0 ? (
                  <div className="settingsEmptyState">
                    <strong>{t('noSavedLocationsYet')}</strong>
                    <p>{t('noSavedLocationsText')}</p>
                  </div>
                ) : (
                  <div className="settingsSavedLocationList">
                    {savedLocations.map((location) => (
                      <div key={location.id} className="settingsSavedLocationCard">
                        <div className="settingsSavedLocationIcon">📍</div>

                        <div className="settingsSavedLocationMiddle">
                          <strong>{location.label}</strong>
                          <p>{location.addressDetails || `${location.latitude}, ${location.longitude}`}</p>
                          <small>{location.latitude}, {location.longitude}</small>
                        </div>

                        <div className="settingsSavedLocationActions">
                          <button type="button" onClick={() => useSavedLocationFromSettings(location.id).catch(() => {})}>
                            {t('use')}
                          </button>
                          <button type="button" className="removeSavedButton" onClick={() => removeSavedLocation(location.id).catch(() => {})}>
                            {t('remove')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {settingsActiveTool === 'orders' ? (
                <section
                  ref={(node) => {
                    settingsSectionRefs.current.orders = node;
                  }}
                  className={`settingsPanel settingsPanelFull${getHighlightedSettingsClass('orders')}`}
                >
                  <div className="settingsPanelHeader">
                    <span>📦</span>
                    <div>
                      <h3>{t('orderHistory')}</h3>
                      <p>{customerSession ? 'Live from your Darik customer account.' : t('loginRequiredText')}</p>
                    </div>
                  </div>

                  {customerSession ? (
                    <>
                      <button type="button" className="settingsInlineButton" onClick={() => loadCustomerOrders(customerProfile?.id).catch(() => {})}>
                        {t('refreshOrders')}
                      </button>

                      {customerOrders.length === 0 ? (
                        <div className="settingsEmptyState">
                          <strong>{t('noOrdersYet')}</strong>
                          <p>Orders placed from the app or webpage will appear here.</p>
                        </div>
                      ) : (
                        <div className="settingsOrderList">
                          {customerOrders.map((order) => (
                            <div key={order.id} className="settingsOrderCard">
                              <div className="settingsOrderHeader">
                                <div>
                                  <strong>Order {getOrderDisplayNumber(order)}</strong>
                                  <p>Placed: {formatDisplayDate(order.created_at)}</p>
                                </div>
                                <span className="settingsStatusPill">{String(order.order_status ?? 'placed').replace(/_/g, ' ')}</span>
                              </div>

                              <div className="settingsOrderClosedSummary">
                                <span>{getItemsForOrder(order.id).length} item{getItemsForOrder(order.id).length === 1 ? '' : 's'}</span>
                                <span>{order.delivered_at ? `Delivered ${formatDisplayDate(order.delivered_at)}` : String(order.order_status ?? 'placed').replace(/_/g, ' ')}</span>
                                <strong>{money(order.customer_amount_due ?? order.total)} JOD</strong>
                              </div>

                              <button
                                type="button"
                                className="settingsOrderExpandButton"
                                onClick={() => togglePastOrderDetails(order.id)}
                              >
                                {isPastOrderExpanded(order.id) ? 'Hide full details' : 'Show full details'}
                              </button>

                              {isPastOrderExpanded(order.id) ? (
                                <div className="settingsOrderExpandedDetails">


                              <div className="settingsOrderDetailGrid">
                                <div>
                                  <span>Order date</span>
                                  <strong>{formatDisplayDate(order.created_at)}</strong>
                                </div>
                                <div>
                                  <span>Delivered</span>
                                  <strong>{order.delivered_at ? formatDisplayDate(order.delivered_at) : 'Not delivered yet'}</strong>
                                </div>
                                <div>
                                  <span>Delivery option</span>
                                  <strong>{order.delivery_eta_label || order.delivery_option || 'Not saved'}</strong>
                                </div>
                                <div>
                                  <span>Payment</span>
                                  <strong>{String(order.payment_method ?? 'Cash on delivery').replace(/_/g, ' ')}</strong>
                                </div>
                              </div>

                              <div className="settingsOrderTotals settingsOrderTotalsDetailed">
                                <div><span>{t('subtotal')}</span><strong>{money(order.subtotal)} JOD</strong></div>
                                <div><span>{t('delivery')}</span><strong>{money(order.delivery_fee)} JOD</strong></div>
                                <div className="grand"><span>{t('total')}</span><strong>{money(order.customer_amount_due ?? order.total)} JOD</strong></div>
                              </div>

                              {order.delivery_address_details ? (
                                <div className="settingsOrderAddressBox">
                                  <strong>Delivery address</strong>
                                  <p>{order.delivery_address_details}</p>
                                  {order.delivery_note ? <small>Note: {order.delivery_note}</small> : null}
                                </div>
                              ) : null}

                              {order.delivery_eta_label ? <p className="settingsOrderEta">{order.delivery_eta_label}</p> : null}
                              {order.driver_stops_away_label ? <p className="settingsOrderEta">{order.driver_stops_away_label}</p> : null}
                              {hasDeliveryCodeForDriver(order) ? (
                                <div className="settingsOrderDeliveryCodeBox">
                                  <span>{t('deliveryCode')}</span>
                                  <strong>{String(order.delivery_pin ?? '').trim()}</strong>
                                  <p>{t('giveCodeToDriver')}</p>
                                </div>
                              ) : null}

                              <div className="settingsOrderItems">
                                <strong>{t('orderItems')}</strong>
                                {getItemsForOrder(order.id).map((item) => {
                                  const returnRequest = getReturnRequestForItem(order.id, item.id);
                                  const returnOpen = isReturnWindowOpen(order);
                                  const deliveredForReturn = isOrderDeliveredForReturn(order);
                                  const returnBusy = returnRequestBusyItemId === item.id;
                                  const alreadyActiveReturn = Boolean(returnRequest && !['cancelled', 'denied', 'rejected'].includes(String(returnRequest.request_status ?? '').toLowerCase()));
                                  const returnUnavailableReason = getReturnUnavailableReason(order);
                                  const returnButtonTitle = returnOpen ? t('returnReplaceThisItem') : returnUnavailableReason;
                                  const itemPhotoUrl = getOrderItemPhotoUrl(item);

                                  return (
                                    <div key={item.id} className="settingsOrderItemRow settingsOrderItemRowStacked settingsOrderItemRowWithPhoto">
                                      <div className="settingsOrderItemPhotoBox">
                                        {itemPhotoUrl ? (
                                          <img src={itemPhotoUrl} alt={item.product_name || 'Ordered item'} />
                                        ) : (
                                          <span>📦</span>
                                        )}
                                      </div>
                                      <div className="settingsOrderItemContent">
                                        <div className="settingsOrderItemMainLine settingsOrderItemMainLineDetailed">
                                        <span>
                                          {item.product_name || 'Item'}
                                          {item.size_label_snapshot ? ` • Size ${item.size_label_snapshot}` : ''}
                                        </span>
                                        <small>
                                          Qty {Number(item.quantity ?? 0)}
                                          {' • '}Unit {money((item as any).unit_price ?? (Number(item.line_total ?? 0) / Math.max(Number(item.quantity ?? 1), 1)))} JOD
                                          {' • '}Line total {money(item.line_total ?? 0)} JOD
                                        </small>
                                      </div>

                                      {returnRequest ? (
                                        <div className="settingsReturnStatusBox">
                                          <strong>{t('returnStatus')}</strong>
                                          <p>{getReturnStatusLabel(returnRequest)}</p>
                                        </div>
                                      ) : null}

                                      {!alreadyActiveReturn ? (
                                        <div className="settingsReturnActions">
                                          <button
                                            type="button"
                                            className="settingsReturnButton"
                                            disabled={returnBusy}
                                            onClick={() => openDarikReturnCheckout(order, item, 'credit_return')}
                                            title={returnOpen ? t('darikCreditReturn') : returnButtonTitle}
                                          >
                                            {returnBusy ? t('pleaseWait') : t('darikCreditReturn')}
                                          </button>

                                          <button
                                            type="button"
                                            className="settingsReturnButton settingsReturnButtonAlt"
                                            disabled={returnBusy}
                                            onClick={() => openDarikReturnCheckout(order, item, 'exact_replacement')}
                                            title={returnOpen ? t('exactReplacement') : returnButtonTitle}
                                          >
                                            {t('exactReplacement')}
                                          </button>

                                          {!returnOpen ? (
                                            <span className="settingsReturnUnavailableBox">{returnUnavailableReason || t('returnNoLongerQualified')}</span>
                                          ) : (
                                            <span className="settingsReturnHelp">{t('returnReplaceThisItem')}</span>
                                          )}
                                        </div>
                                      ) : null}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                              
                                </div>
                              ) : null}

                              <button
                                type="button"
                                className="settingsGhostButton"
                                onClick={() => {
                                  setSupportRelatedOrderId(order.id);
                                  setSupportIssueType('Order issue');
                                  setSupportSubject(`Help with order ${getOrderDisplayNumber(order)}`);
                                  openSettingsTool('support');
                                }}
                              >
                                {t('contactSupport')}
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="settingsSignInNotice">{t('loginRequiredText')}</div>
                  )}
                </section>
              ) : null}

              {settingsActiveTool === 'support' ? (
                <section
                  ref={(node) => {
                    settingsSectionRefs.current.support = node;
                  }}
                  className={`settingsPanel settingsPanelFull${getHighlightedSettingsClass('support')}`}
                >
                  <div className="settingsPanelHeader">
                    <span>💬</span>
                    <div>
                      <h3>{t('support')}</h3>
                      <p>{customerSession ? 'Message Darik support from the same customer record used in the app.' : t('loginRequiredText')}</p>
                    </div>
                  </div>

                  {customerSession ? (
                    <div className="settingsSupportLayout">
                      <div className="settingsSupportForm">
                        <h4>{t('newSupportMessage')}</h4>

                        <label>
                          {t('issueType')}
                          <select className="settingsSelect" value={supportIssueType} onChange={(event) => setSupportIssueType(event.target.value)}>
                            {CUSTOMER_SUPPORT_ISSUE_TYPES.map((issueType) => (
                              <option key={issueType} value={issueType}>{issueType}</option>
                            ))}
                          </select>
                        </label>

                        <label>
                          Related Order
                          <select className="settingsSelect" value={supportRelatedOrderId ?? ''} onChange={(event) => setSupportRelatedOrderId(event.target.value || null)}>
                            <option value="">No related order</option>
                            {customerOrders.map((order) => (
                              <option key={order.id} value={order.id}>Order {getOrderDisplayNumber(order)}</option>
                            ))}
                          </select>
                        </label>

                        <label>
                          {t('subject')}
                          <input value={supportSubject} onChange={(event) => setSupportSubject(event.target.value)} placeholder="Example: Delivery problem" />
                        </label>

                        <label>
                          {t('message')}
                          <textarea className="settingsTextarea" value={supportMessageBody} onChange={(event) => setSupportMessageBody(event.target.value)} placeholder="Type the details for Darik support." />
                        </label>

                        <button type="button" className="settingsPrimaryButton" disabled={supportBusy} onClick={() => submitSupportThread().catch(() => {})}>
                          {supportBusy ? t('pleaseWait') : t('sendMessage')}
                        </button>
                      </div>

                      <div className="settingsSupportTickets">
                        <div className="settingsSupportTicketsHeader">
                          <h4>{t('mySupportTickets')}</h4>
                          <button type="button" className="settingsInlineButton" onClick={() => loadCustomerSupport(customerProfile?.id).catch(() => {})}>
                            {t('refreshSupport')}
                          </button>
                        </div>

                        {supportThreads.length === 0 ? (
                          <div className="settingsEmptyState">
                            <strong>{t('noSupportTicketsYet')}</strong>
                            <p>New support messages will appear here.</p>
                          </div>
                        ) : (
                          supportThreads.map((thread) => {
                            const threadMessages = getMessagesForSupportThread(thread.id);
                            const isSelected = selectedSupportThreadId === thread.id;

                            return (
                              <div key={thread.id} className={`supportThreadCard ${isSelected ? 'active' : ''}`}>
                                <button type="button" className="supportThreadTop" onClick={() => setSelectedSupportThreadId(isSelected ? null : thread.id)}>
                                  <div>
                                    <strong>{thread.subject || 'Support ticket'}</strong>
                                    <p>{thread.last_message_preview || thread.issue_type || ''}</p>
                                  </div>
                                  <span>{String(thread.status ?? 'open').replace(/_/g, ' ')}</span>
                                </button>

                                {isSelected ? (
                                  <div className="supportThreadBody">
                                    <div className="supportChatHeader">
                                      <strong>Darik Support Chat</strong>
                                      <span>{threadMessages.length} message{threadMessages.length === 1 ? '' : 's'}</span>
                                    </div>

                                    <div className="supportMessages">
                                      {threadMessages.length === 0 ? (
                                        <div className="supportChatEmpty">No messages loaded yet. Tap refresh if this was just created.</div>
                                      ) : (
                                        threadMessages.map((message) => (
                                          <div key={message.id} className={`supportMessage ${String(message.sender_role ?? '').toLowerCase() === 'customer' ? 'customer' : 'admin'}`}>
                                            <strong>{message.sender_name || message.sender_role || 'Darik'}</strong>
                                            <p>{message.message_body}</p>
                                            <small>{formatDisplayDate(message.created_at)}</small>
                                          </div>
                                        ))
                                      )}
                                    </div>

                                    {isSupportThreadClosedForCustomer(thread) ? (
                                      <div className="supportThreadClosedBox">
                                        <strong>Chat closed</strong>
                                        <p>{getSupportThreadClosedLabel(thread)}</p>
                                      </div>
                                    ) : (
                                      <>
                                        <textarea
                                          className="settingsTextarea"
                                          value={supportReplyBody}
                                          onChange={(event) => setSupportReplyBody(event.target.value)}
                                          placeholder={t('replySupportPlaceholder')}
                                        />
                                        <button type="button" className="settingsSecondaryButton" disabled={supportBusy} onClick={() => submitSupportReply(thread).catch(() => {})}>
                                          {supportBusy ? t('pleaseWait') : t('sendReply')}
                                        </button>
                                      </>
                                    )}
                                  </div>
                                ) : null}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="settingsSignInNotice">{t('loginRequiredText')}</div>
                  )}
                </section>
              ) : null}

              {settingsActiveTool === 'password' ? (
                <section
                  ref={(node) => {
                    settingsSectionRefs.current.password = node;
                  }}
                  className={`settingsPanel settingsPanelFull${getHighlightedSettingsClass('password')}`}
                >
                  <div className="settingsPanelHeader">
                    <span>🔐</span>
                    <div>
                      <h3>{t('changeYourPassword')}</h3>
                      <p>{t('passwordChangeHelp')}</p>
                    </div>
                  </div>

                  {customerSession ? (
                    <div className="settingsPasswordBox">
                      <label>
                        {t('newPassword')}
                        <input type="password" value={newCustomerPassword} onChange={(event) => setNewCustomerPassword(event.target.value)} placeholder={t('newPassword')} />
                      </label>

                      <label>
                        {t('confirmNewPassword')}
                        <input type="password" value={confirmCustomerPassword} onChange={(event) => setConfirmCustomerPassword(event.target.value)} placeholder={t('confirmNewPassword')} />
                      </label>

                      <button type="button" className="settingsPrimaryButton" disabled={passwordBusy} onClick={() => handleCustomerChangePassword().catch(() => {})}>
                        {passwordBusy ? t('updatingPassword') : t('updatePassword')}
                      </button>
                    </div>
                  ) : (
                    <div className="settingsSignInNotice">{t('loginRequiredText')}</div>
                  )}
                </section>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}

      {cartOpen ? (
        <div className="modalOverlay" onClick={() => setCartOpen(false)}>
          <div className="cartSheet" onClick={(event) => event.stopPropagation()}>
            <div className="cartHandle" />

            <div className="cartHeader">
              <div>
                <h2>Your Cart</h2>
                <p>{cartCount} item{cartCount === 1 ? '' : 's'} ready for delivery</p>
              </div>

              <button type="button" onClick={() => setCartOpen(false)}>
                Close
              </button>
            </div>

            {cartItems.length === 0 ? (
              <>
                <div className="emptyCard">
                  <h3>Your cart is empty</h3>
                  <p>Add products to start an order.</p>
                </div>

                {savedForLaterItems.length > 0 ? (
                  <div className="savedForLaterBox">
                    <div className="savedForLaterHeader">
                      <h3>Saved for Later</h3>
                      <span>{savedForLaterItems.length} item{savedForLaterItems.length === 1 ? '' : 's'}</span>
                    </div>

                    <div className="savedForLaterList">
                      {savedForLaterItems.map((item) => (
                        <div key={item.id} className="savedForLaterItem">
                          <div className="cartImage">
                            {item.photoUrl ? <img src={item.photoUrl} alt={item.name} /> : <span>{shortCode(item.name)}</span>}
                          </div>

                          <div className="cartMiddle">
                            <h3>{item.name}</h3>
                            {item.selectedCartSize ? <p>Size: {item.selectedCartSize}</p> : null}
                            <p>Saved item • {money(item.priceNumber)} JOD each</p>
                          </div>

                          <div className="savedForLaterActions">
                            <button type="button" onClick={() => moveSavedItemToCart(item.id)}>
                              Move to Cart
                            </button>
                            <button type="button" className="removeSavedButton" onClick={() => removeSavedForLaterItem(item.id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <div className="cartItemsList">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cartItem">
                      <div className="cartImage">
                        {item.photoUrl ? <img src={item.photoUrl} alt={item.name} /> : <span>{shortCode(item.name)}</span>}
                      </div>

                      <div className="cartMiddle">
                        <h3>{item.name}</h3>
                        {item.selectedCartSize ? <p>Size: {item.selectedCartSize}</p> : null}
                        <p>{money(item.priceNumber)} JOD each</p>
                        {cartItemIsAtStockLimit(item) ? <p className="stockLimitText">Max available in stock</p> : null}
                      </div>

                      <div className="cartActionsColumn">
                        <div className="quantityBox">
                          <button type="button" onClick={() => decreaseQuantity(item.id)}>-</button>
                          <strong>{item.quantity}</strong>
                          <button
                            type="button"
                            disabled={cartItemIsAtStockLimit(item)}
                            onClick={() => increaseQuantity(item.id)}
                          >
                            +
                          </button>
                        </div>

                        <button type="button" className="saveForLaterButton" onClick={() => saveCartItemForLater(item.id)}>
                          Save for Later
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {savedForLaterItems.length > 0 ? (
                  <div className="savedForLaterBox">
                    <div className="savedForLaterHeader">
                      <h3>Saved for Later</h3>
                      <span>{savedForLaterItems.length} item{savedForLaterItems.length === 1 ? '' : 's'}</span>
                    </div>

                    <div className="savedForLaterList">
                      {savedForLaterItems.map((item) => (
                        <div key={item.id} className="savedForLaterItem">
                          <div className="cartImage">
                            {item.photoUrl ? <img src={item.photoUrl} alt={item.name} /> : <span>{shortCode(item.name)}</span>}
                          </div>

                          <div className="cartMiddle">
                            <h3>{item.name}</h3>
                            {item.selectedCartSize ? <p>Size: {item.selectedCartSize}</p> : null}
                            <p>Saved item • {money(item.priceNumber)} JOD each</p>
                          </div>

                          <div className="savedForLaterActions">
                            <button type="button" onClick={() => moveSavedItemToCart(item.id)}>
                              Move to Cart
                            </button>
                            <button type="button" className="removeSavedButton" onClick={() => removeSavedForLaterItem(item.id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="checkoutBox">
                  <h3>Choose delivery</h3>
                  {!selectedDeliveryOption ? (
                    <div className="deliveryChoiceRequired">Choose one delivery option to continue. Nothing is preselected.</div>
                  ) : null}

                  <button type="button" className={`deliveryCard ${selectedDeliveryOption === 'next_day_free' && freeNextDayUnlocked ? 'active' : ''}`} disabled={!freeNextDayUnlocked} onClick={() => setSelectedDeliveryOption('next_day_free')}>
                    <div>
                      <strong>Free Next-Day Delivery</strong>
                      <p>
                        {freeNextDayUnlocked
                          ? 'Free tomorrow delivery unlocked.'
                          : `Add ${money(FREE_NEXT_DAY_MIN_ORDER - subtotal)} JOD more to unlock.`}
                      </p>
                    </div>
                    <span>0.00 JOD</span>
                  </button>

                  <button type="button" className={`deliveryCard ${selectedDeliveryOption === 'express_2hr' ? 'active' : ''}`} disabled={checkoutDistanceKm !== null && checkoutDistanceKm > EXPRESS_DELIVERY_RADIUS_KM} onClick={() => setSelectedDeliveryOption('express_2hr')}>
                    <div>
                      <strong>Express Delivery</strong>
                      <p>Delivered today under 2 hours • up to 5 km from warehouse.</p>
                    </div>
                    <span>{money(EXPRESS_DELIVERY_FEE)} JOD</span>
                  </button>

                  <div className="summaryRows">
                    <div>
                      <span>Subtotal</span>
                      <strong>{money(subtotal)} JOD</strong>
                    </div>
                    <div>
                      <span>Delivery</span>
                      <strong>{money(deliveryFee)} JOD</strong>
                    </div>
                    <div className="grand">
                      <span>Total</span>
                      <strong>{money(total)} JOD</strong>
                    </div>
                  </div>

                  {!customerSession?.user || !customerProfile?.id ? (
                    <div className="checkoutAccountNotice">
                      <strong>Account required</strong>
                      <p>Create a Darik customer account or log in before checkout. You can still browse and add items without signing in.</p>
                    </div>
                  ) : null}

                  <button className="checkoutButton" type="button" onClick={openCheckoutFromCart}>
                    {customerSession?.user && customerProfile?.id ? 'Continue to Checkout' : 'Create Account / Login to Checkout'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {checkoutOpen ? (
        <div className="checkoutFullScreenOverlay">
          <div className="checkoutFullScreenPage">
            <div className="checkoutFullTopBar">
              <button type="button" className="checkoutBackButton" onClick={() => setCheckoutOpen(false)}>
                ← Back to Cart
              </button>

              <div>
                <h2>Checkout</h2>
                <p>Confirm delivery, location, and payment</p>
              </div>

              <div className="checkoutTopTotal">
                <span>Total Due</span>
                <strong>{money(total)} JOD</strong>
              </div>
            </div>

            {checkoutError ? <div className="checkoutErrorBox">{checkoutError}</div> : null}

            {customerSession?.user && customerProfile?.id ? (
              <div className="checkoutAccountRequiredBox">
                <div>
                  <span>Signed in checkout</span>
                  <strong>{customerProfile.full_name || customerName || customerSession.user.email}</strong>
                  <p>This order will be saved to the customer account. Guest checkout is not available on Darik.</p>
                </div>
                <button type="button" onClick={() => setSettingsOpen(true)}>
                  Account Settings
                </button>
              </div>
            ) : null}

            <div className="checkoutGrid">
              <section className="checkoutPanel">
                <h3>Customer Details</h3>

                <label>
                  Full Name
                  <input
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                    placeholder="Example: Ahmad Saleh"
                  />
                </label>

                <label>
                  Phone Number
                  <input
                    value={customerPhone}
                    onChange={(event) => setCustomerPhone(event.target.value)}
                    placeholder="Example: 0790000000"
                  />
                </label>
              </section>

              <section className="checkoutPanel checkoutLocationPanel">
                <h3>Delivery Location</h3>

                <div className="currentLocationBox">
                  <div>
                    <strong>Use Current Location</strong>
                    <p>Customer can share GPS from this browser for faster delivery setup.</p>
                  </div>

                  <button type="button" disabled={locationLoading} onClick={useCurrentLocationForCheckout}>
                    {locationLoading ? 'Getting Location...' : 'Use Current Location'}
                  </button>
                </div>

                {savedLocations.length > 0 ? (
                  <div className="savedLocationsBox">
                    <strong>Saved Locations</strong>

                    <div className="savedLocationList">
                      {savedLocations.map((location) => (
                        <div
                          key={location.id}
                          className={`savedLocationCard ${selectedSavedLocationId === location.id ? 'active' : ''}`}
                        >
                          <button type="button" onClick={() => applySavedLocation(location.id)}>
                            <span>{location.label}</span>
                            <small>
                              {location.addressDetails || `${location.latitude}, ${location.longitude}`}
                            </small>
                          </button>

                          <button type="button" className="deleteSavedLocationButton" onClick={() => removeSavedLocation(location.id)}>
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {locationMessage ? <div className="locationMessage">{locationMessage}</div> : null}

                {checkoutDistanceKm !== null ? (
                  <div className={`deliveryRadiusStatus ${checkoutDeliveryRadiusWarning ? 'blocked' : 'allowed'}`}>
                    <strong>Warehouse Distance: {checkoutDistanceKm.toFixed(1)} km</strong>
                    <p>
                      {checkoutDeliveryRadiusWarning ||
                        `This location is inside the Darik delivery area. Express limit: ${EXPRESS_DELIVERY_RADIUS_KM} km. Next-Day limit: ${NEXT_DAY_DELIVERY_RADIUS_KM} km.`}
                    </p>
                  </div>
                ) : null}

                <div className="manualGpsBox">
                  <strong>GPS Coordinates</strong>
                  <p>Use current location above, choose a saved location, or enter GPS manually.</p>

                  <div className="gpsInputGrid">
                    <label>
                      Latitude
                      <input
                        value={manualLatitude}
                        onChange={(event) => {
                          setManualLatitude(event.target.value);
                          setSelectedSavedLocationId('');
                        }}
                        placeholder="31.953900"
                      />
                    </label>

                    <label>
                      Longitude
                      <input
                        value={manualLongitude}
                        onChange={(event) => {
                          setManualLongitude(event.target.value);
                          setSelectedSavedLocationId('');
                        }}
                        placeholder="35.910600"
                      />
                    </label>
                  </div>
                </div>

                <label>
                  Extra Address Details
                  <textarea
                    value={deliveryAddressDetails}
                    onChange={(event) => setDeliveryAddressDetails(event.target.value)}
                    placeholder="Building, street, floor, apartment, nearby landmark"
                  />
                </label>

                <label>
                  Delivery Note
                  <textarea
                    value={deliveryNote}
                    onChange={(event) => setDeliveryNote(event.target.value)}
                    placeholder="Optional: call when nearby"
                  />
                </label>

                <label className="saveLocationToggle">
                  <input
                    type="checkbox"
                    checked={saveLocationForFuture}
                    onChange={(event) => setSaveLocationForFuture(event.target.checked)}
                  />
                  Save this location for future purchases
                </label>

                {saveLocationForFuture ? (
                  <label>
                    Location Name
                    <input
                      value={newLocationName}
                      onChange={(event) => setNewLocationName(event.target.value)}
                      placeholder="Example: Home, Work, Mom's House"
                    />
                  </label>
                ) : null}
              </section>

              <section className="checkoutPanel">
                <h3>Delivery Speed</h3>

                <button
                  type="button"
                  className={`deliveryCard checkoutDeliveryCard ${selectedDeliveryOption === 'next_day_free' && freeNextDayUnlocked ? 'active' : ''}`}
                  disabled={!freeNextDayUnlocked || (checkoutDistanceKm !== null && checkoutDistanceKm > NEXT_DAY_DELIVERY_RADIUS_KM)}
                  onClick={() => setSelectedDeliveryOption('next_day_free')}
                >
                  <div>
                    <strong>Free Next-Day Delivery</strong>
                    <p>
                      {checkoutDistanceKm !== null && checkoutDistanceKm > NEXT_DAY_DELIVERY_RADIUS_KM
                        ? `Outside ${NEXT_DAY_DELIVERY_RADIUS_KM} km delivery area`
                        : freeNextDayUnlocked
                          ? `${buildDeliveryEtaLabel('next_day_free')} • up to ${NEXT_DAY_DELIVERY_RADIUS_KM} km`
                          : `Requires ${FREE_NEXT_DAY_MIN_ORDER.toFixed(2)} JOD minimum. Add ${money(FREE_NEXT_DAY_MIN_ORDER - subtotal)} JOD more.`}
                    </p>
                  </div>
                  <span>0.00 JOD</span>
                </button>

                <button
                  type="button"
                  className={`deliveryCard checkoutDeliveryCard ${selectedDeliveryOption === 'express_2hr' ? 'active' : ''}`}
                  disabled={checkoutDistanceKm !== null && checkoutDistanceKm > EXPRESS_DELIVERY_RADIUS_KM}
                  onClick={() => setSelectedDeliveryOption('express_2hr')}
                >
                  <div>
                    <strong>Express Delivery</strong>
                    <p>{checkoutDistanceKm !== null && checkoutDistanceKm > EXPRESS_DELIVERY_RADIUS_KM ? `Outside ${EXPRESS_DELIVERY_RADIUS_KM} km Express area` : `${buildDeliveryEtaLabel('express_2hr')} • up to ${EXPRESS_DELIVERY_RADIUS_KM} km`}</p>
                  </div>
                  <span>{money(EXPRESS_DELIVERY_FEE)} JOD</span>
                </button>
              </section>

              <section className="checkoutPanel">
                <h3>Payment Method</h3>
                <div className="paymentMethodCard">
                  <strong>Cash on Delivery</strong>
                  <p>Customer pays the driver when the order arrives.</p>
                </div>
              </section>
            </div>

            <div className="checkoutReviewBox">
              <h3>Order Review</h3>

              <div className="checkoutReviewItems">
                {cartItems.map((item) => (
                  <div key={item.id}>
                    <span>
                      {item.quantity} × {item.name}
                      {item.selectedCartSize ? ` • Size ${item.selectedCartSize}` : ''}
                    </span>
                    <strong>{money(item.priceNumber * item.quantity)} JOD</strong>
                  </div>
                ))}
              </div>

              <div className="summaryRows checkoutSummaryRows">
                <div>
                  <span>Subtotal</span>
                  <strong>{money(subtotal)} JOD</strong>
                </div>
                <div>
                  <span>Delivery</span>
                  <strong>{money(deliveryFee)} JOD</strong>
                </div>
                <div className="grand">
                  <span>Total Due</span>
                  <strong>{money(total)} JOD</strong>
                </div>
              </div>

              <button className="checkoutButton placeOrderButton" type="button" disabled={placingOrder} onClick={placeWebOrder}>
                {placingOrder ? 'Placing Order...' : 'Place Cash Order'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {pendingReturnCheckout ? (
        <div className="modalOverlay returnCheckoutOverlay" onClick={closeDarikReturnCheckout}>
          <div className="returnCheckoutModal" onClick={(event) => event.stopPropagation()}>
            <div className="returnCheckoutHeader">
              <div>
                <span>Return Checkout</span>
                <h2>Review your return request</h2>
              </div>
              <button type="button" className="returnCheckoutCloseButton" onClick={closeDarikReturnCheckout} disabled={Boolean(returnRequestBusyItemId)}>
                ×
              </button>
            </div>

            <div className="returnCheckoutItemCard">
              <div className="returnCheckoutItemThumb">↩</div>
              <div>
                <strong>{pendingReturnCheckout.item.product_name || 'Item'}</strong>
                <p>
                  {pendingReturnCheckout.item.size_label_snapshot ? `Size ${pendingReturnCheckout.item.size_label_snapshot} • ` : ''}
                  Qty {Number(pendingReturnCheckout.item.quantity ?? 0)} • {money(pendingReturnCheckout.item.line_total ?? 0)} JOD
                </p>
                <small>Order #{getOrderDisplayNumber(pendingReturnCheckout.order)}</small>
              </div>
            </div>

            <div className="returnCheckoutResolutionBox">
              <span>Return option</span>
              <strong>
                {pendingReturnCheckout.resolutionType === 'exact_replacement' ? t('exactReplacement') : t('darikCreditReturn')}
              </strong>
              <p>
                {pendingReturnCheckout.resolutionType === 'exact_replacement' ? t('replacementReturnNote') : t('creditReturnNote')}
              </p>
            </div>

            {pendingReturnCheckout.unavailableReason ? (
              <div className="returnCheckoutUnavailableBox">
                <strong>Return not available</strong>
                <p>{pendingReturnCheckout.unavailableReason}</p>
              </div>
            ) : null}

            <label className="returnCheckoutReasonBox">
              <span>Explain why you want to return this item</span>
              <textarea
                value={returnCheckoutReason}
                onChange={(event) => setReturnCheckoutReason(event.target.value)}
                placeholder="Example: item arrived damaged, wrong size, product not as expected..."
                rows={5}
                disabled={Boolean(pendingReturnCheckout.unavailableReason)}
                autoFocus={!pendingReturnCheckout.unavailableReason}
              />
            </label>

            <div className="returnCheckoutFooter">
              <button type="button" className="settingsGhostButton" onClick={closeDarikReturnCheckout} disabled={Boolean(returnRequestBusyItemId)}>
                Cancel
              </button>
              <button
                type="button"
                className="checkoutButton returnCheckoutSubmitButton"
                onClick={() => submitDarikReturnRequestFromCheckout().catch(() => {})}
                disabled={Boolean(returnRequestBusyItemId) || Boolean(pendingReturnCheckout.unavailableReason) || returnCheckoutReason.trim().length < 8}
              >
                {returnRequestBusyItemId ? 'Submitting...' : 'Submit return request'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {orderPlacedOpen ? (
        <div className="modalOverlay" onClick={() => setOrderPlacedOpen(false)}>
          <div className="orderPlacedModal" onClick={(event) => event.stopPropagation()}>
            <div className="successBadge">✓</div>
            <h2>Order Placed</h2>
            <p>Your Darik order was created successfully.</p>

            <div className="pinBox">
              <span>Your Delivery PIN</span>
              <strong>{placedOrderPin || 'Pending'}</strong>
            </div>

            <button type="button" className="checkoutButton" onClick={() => setOrderPlacedOpen(false)}>
              Done
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}