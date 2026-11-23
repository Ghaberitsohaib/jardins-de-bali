import 'dart:convert';
import 'package:flutter_test/flutter_test.dart';
import 'package:jardins_de_bali_app/config/supabase_config.dart';
import 'package:jardins_de_bali_app/models/app_models.dart';
import 'package:jardins_de_bali_app/models/user_account_model.dart';
import 'package:jardins_de_bali_app/services/pdf_document_service.dart';

void main() {
  group('PdfDocumentService', () {
    test('buildPaymentReceiptPdf generates valid PDF bytes', () async {
      const payment = PaymentRecord(
        id: 'pay-01',
        date: '2026-11-23',
        amount: 370000,
        trancheLabel: 'Tranche 1 : Réservation (20%)',
        method: 'Virement bancaire',
        status: 'Payé',
        receiptRef: 'REC-2026-001',
      );
      const user = UserAccount(
        id: 'u-1',
        name: 'Karim Benjelloun',
        email: 'karim@client.ma',
        phone: '+212 6 61 45 89 12',
        password: 'secret',
        role: UserRole.client,
        assignedLotId: 'APP 1',
        financialProfile: ClientFinancialProfile(
          totalPrice: 1850000,
          payments: [payment],
        ),
      );

      final bytes = await PdfDocumentService.buildPaymentReceiptPdf(
        user: user,
        payment: payment,
      );

      expect(bytes.length, greaterThan(1000));
      expect(utf8.decode(bytes.sublist(0, 5)), '%PDF-');
    });

    test('buildLotBrochurePdf generates valid PDF bytes', () async {
      final lot = ResidenceLot.fromJson({
        'id': 'APP 1',
        'slug': 'app-1',
        'title': 'APP 1 — Duplex 3 Chambres',
        'category': 'Duplex',
        'type': 'Type 1 : Duplex',
        'floor': 0,
        'floorName': 'Rez-de-Chaussée & Mezzanine',
        'surface': 124.0,
        'surfaceFormatted': '124 m² + 22 m² Terrasse',
        'rooms': 4,
        'roomsText': 'Duplex · 3 Chambres · Salon',
        'bedrooms': 3,
        'bathrooms': 3,
        'status': 'Disponible',
        'view': 'Vue Patio & Fontaine',
        'orientation': 'Quartier Rahham',
        'features': ['Terrasse privative', 'Parking sous-sol'],
        'assets': {
          'planLocalPath': '02_PLANS_ARCHITECTURAUX/2D_Plans_Par_Etage/app-1.webp',
          'planRemoteUrl': '',
          'thumbLocalPath': '',
          'thumbRemoteUrl': '',
          'gallery': [],
        },
        'paymentSchedule': <String, dynamic>{},
      });

      final bytes = await PdfDocumentService.buildLotBrochurePdf(lot: lot);

      expect(bytes.length, greaterThan(1000));
      expect(utf8.decode(bytes.sublist(0, 5)), '%PDF-');
    });
  });

  group('SupabaseConfig', () {
    test('isConfigured validates https URL and anon key length', () {
      const empty = SupabaseConfig(url: '', anonKey: '');
      const valid = SupabaseConfig(
        url: 'https://demo.supabase.co',
        anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example',
      );
      expect(empty.isConfigured, isFalse);
      expect(valid.isConfigured, isTrue);
    });
  });
}
