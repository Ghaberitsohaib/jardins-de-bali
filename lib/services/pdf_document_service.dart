// =========================================================================
// JARDINS DE BALI — OFFICIAL PDF DOCUMENT GENERATOR (FRANÇAIS)
// 1. Reçu Officiel de Versement VEFA (Loi 107-12)
// 2. Fiche Officielle d'Appartement avec Plan 2D intégré
// =========================================================================

import 'dart:ui' as ui;
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import '../models/app_models.dart';
import '../models/user_account_model.dart';

class PdfDocumentService {
  static const PdfColor _darkGreen = PdfColor.fromInt(0xFF101810);
  static const PdfColor _gold = PdfColor.fromInt(0xFFC5A880);
  static const PdfColor _cream = PdfColor.fromInt(0xFFFAF7F0);
  static const PdfColor _border = PdfColor.fromInt(0xFFE5DFD2);
  static const PdfColor _textDark = PdfColor.fromInt(0xFF141A13);
  static const PdfColor _textMuted = PdfColor.fromInt(0xFF5D665B);

  /// Sanitizes characters outside PDF built-in WinAnsi font encoding.
  static String _safe(String input) {
    return input
        .replaceAll('œ', 'oe')
        .replaceAll('Œ', 'OE')
        .replaceAll('—', '-')
        .replaceAll('–', '-')
        .replaceAll('•', '-')
        .replaceAll('·', '|')
        .replaceAll('’', "'")
        .replaceAll('‘', "'")
        .replaceAll('«', '"')
        .replaceAll('»', '"')
        .replaceAll('€', 'EUR')
        .replaceAll('✓', 'OK');
  }

  /// Decodes any Flutter image asset (including WebP) into PNG bytes for PDF.
  static Future<Uint8List?> _loadAssetAsPng(String assetPath) async {
    try {
      final raw = await rootBundle.load('assets/$assetPath');
      final bytes = raw.buffer.asUint8List();
      final codec = await ui.instantiateImageCodec(bytes, targetWidth: 1100);
      final frame = await codec.getNextFrame();
      final pngData =
          await frame.image.toByteData(format: ui.ImageByteFormat.png);
      frame.image.dispose();
      return pngData?.buffer.asUint8List();
    } catch (e) {
      debugPrint('PdfDocumentService asset decode skipped ($assetPath): $e');
      return null;
    }
  }

  /// Generates official VEFA payment receipt PDF bytes.
  static Future<Uint8List> buildPaymentReceiptPdf({
    required UserAccount user,
    required PaymentRecord payment,
    ResidenceLot? lot,
  }) async {
    final doc = pw.Document(
      title: 'Reçu Officiel ${payment.receiptRef} - Jardins de Bali',
      author: 'BaytImmo Groupe Immobilier',
    );
    final fp = user.financialProfile;

    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(28),
        build: (context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              // Luxury Dark Header Banner
              pw.Container(
                width: double.infinity,
                padding: const pw.EdgeInsets.all(22),
                decoration: pw.BoxDecoration(
                  color: _darkGreen,
                  borderRadius: pw.BorderRadius.circular(10),
                  border: pw.Border.all(color: _gold, width: 1.2),
                ),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: pw.CrossAxisAlignment.start,
                  children: [
                    pw.Column(
                      crossAxisAlignment: pw.CrossAxisAlignment.start,
                      children: [
                        pw.Text(
                          'BAYTIMMO GROUPE IMMOBILIER',
                          style: pw.TextStyle(
                            fontSize: 9,
                            fontWeight: pw.FontWeight.bold,
                            letterSpacing: 2,
                            color: _gold,
                          ),
                        ),
                        pw.SizedBox(height: 5),
                        pw.Text(
                          'LES JARDINS DE BALI',
                          style: pw.TextStyle(
                            font: pw.Font.timesBold(),
                            fontSize: 21,
                            color: PdfColors.white,
                          ),
                        ),
                        pw.SizedBox(height: 3),
                        pw.Text(
                          _safe(
                            'Marrakech Menara - Quartier Rahham, Lot B5 | TF 34 603/M',
                          ),
                          style: const pw.TextStyle(
                            fontSize: 8.5,
                            color: PdfColors.grey300,
                          ),
                        ),
                      ],
                    ),
                    pw.Container(
                      padding: const pw.EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 7,
                      ),
                      decoration: pw.BoxDecoration(
                        color: _gold,
                        borderRadius: pw.BorderRadius.circular(6),
                      ),
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.end,
                        children: [
                          pw.Text(
                            'RECU OFFICIEL VEFA',
                            style: pw.TextStyle(
                              fontSize: 8.5,
                              fontWeight: pw.FontWeight.bold,
                              color: _darkGreen,
                            ),
                          ),
                          pw.SizedBox(height: 2),
                          pw.Text(
                            _safe(payment.receiptRef),
                            style: pw.TextStyle(
                              fontSize: 10,
                              fontWeight: pw.FontWeight.bold,
                              color: _darkGreen,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              pw.SizedBox(height: 20),

              // Acquéreur & Bien Grid
              pw.Row(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Expanded(
                    child: pw.Container(
                      padding: const pw.EdgeInsets.all(14),
                      decoration: pw.BoxDecoration(
                        color: _cream,
                        borderRadius: pw.BorderRadius.circular(8),
                        border: pw.Border.all(color: _border),
                      ),
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Text(
                            'ACQUEREUR',
                            style: pw.TextStyle(
                              fontSize: 8,
                              fontWeight: pw.FontWeight.bold,
                              letterSpacing: 1.5,
                              color: _gold,
                            ),
                          ),
                          pw.SizedBox(height: 6),
                          pw.Text(
                            _safe(user.name),
                            style: pw.TextStyle(
                              fontSize: 12,
                              fontWeight: pw.FontWeight.bold,
                              color: _textDark,
                            ),
                          ),
                          pw.SizedBox(height: 3),
                          pw.Text(
                            _safe(user.email),
                            style: const pw.TextStyle(
                              fontSize: 9.5,
                              color: _textMuted,
                            ),
                          ),
                          if (user.phone.isNotEmpty)
                            pw.Text(
                              _safe(user.phone),
                              style: const pw.TextStyle(
                                fontSize: 9.5,
                                color: _textMuted,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                  pw.SizedBox(width: 12),
                  pw.Expanded(
                    child: pw.Container(
                      padding: const pw.EdgeInsets.all(14),
                      decoration: pw.BoxDecoration(
                        color: _cream,
                        borderRadius: pw.BorderRadius.circular(8),
                        border: pw.Border.all(color: _border),
                      ),
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Text(
                            'BIEN IMMOBILIER',
                            style: pw.TextStyle(
                              fontSize: 8,
                              fontWeight: pw.FontWeight.bold,
                              letterSpacing: 1.5,
                              color: _gold,
                            ),
                          ),
                          pw.SizedBox(height: 6),
                          pw.Text(
                            _safe(
                              lot?.title ?? user.assignedLotId ?? 'Lot Réservé',
                            ),
                            style: pw.TextStyle(
                              fontSize: 11.5,
                              fontWeight: pw.FontWeight.bold,
                              color: _textDark,
                            ),
                          ),
                          pw.SizedBox(height: 3),
                          pw.Text(
                            _safe(
                              lot != null
                                  ? '${lot.category} - ${lot.surfaceFormatted}'
                                  : 'Résidence Les Jardins de Bali',
                            ),
                            style: const pw.TextStyle(
                              fontSize: 9.5,
                              color: _textMuted,
                            ),
                          ),
                          if (lot != null)
                            pw.Text(
                              _safe(lot.floorName),
                              style: const pw.TextStyle(
                                fontSize: 9.5,
                                color: _textMuted,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              pw.SizedBox(height: 18),

              // Payment Details Table
              pw.Text(
                'DETAIL DU VERSEMENT ENREGISTRE',
                style: pw.TextStyle(
                  fontSize: 9,
                  fontWeight: pw.FontWeight.bold,
                  letterSpacing: 1.4,
                  color: _textMuted,
                ),
              ),
              pw.SizedBox(height: 8),
              pw.Table(
                border: pw.TableBorder.all(color: _border),
                columnWidths: {
                  0: const pw.FlexColumnWidth(2.6),
                  1: const pw.FlexColumnWidth(1.2),
                  2: const pw.FlexColumnWidth(1.5),
                  3: const pw.FlexColumnWidth(1.3),
                },
                children: [
                  pw.TableRow(
                    decoration: const pw.BoxDecoration(color: _darkGreen),
                    children: [
                      _cellHeader('Echeance / Tranche VEFA'),
                      _cellHeader('Date'),
                      _cellHeader('Mode de reglement'),
                      _cellHeader('Montant (MAD)', alignRight: true),
                    ],
                  ),
                  pw.TableRow(
                    decoration: const pw.BoxDecoration(color: PdfColors.white),
                    children: [
                      _cellBody(_safe(payment.trancheLabel), bold: true),
                      _cellBody(_safe(payment.date)),
                      _cellBody(_safe(payment.method)),
                      _cellBody(
                        _safe(formatMadAmount(payment.amount)),
                        bold: true,
                        alignRight: true,
                      ),
                    ],
                  ),
                ],
              ),
              pw.SizedBox(height: 18),

              // Global Financial Balance Box
              pw.Container(
                padding: const pw.EdgeInsets.all(16),
                decoration: pw.BoxDecoration(
                  color: _cream,
                  borderRadius: pw.BorderRadius.circular(8),
                  border: pw.Border.all(color: _gold, width: 1),
                ),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    _summaryCol(
                      'PRIX TOTAL CONVENU',
                      _safe(formatMadAmount(fp.totalPrice)),
                    ),
                    _summaryCol(
                      'TOTAL PAYE A CE JOUR',
                      _safe(formatMadAmount(fp.paidAmount)),
                    ),
                    _summaryCol(
                      'SOLDE RESTANT DU',
                      _safe(formatMadAmount(fp.remainingAmount)),
                    ),
                    _summaryCol(
                      'AVANCEMENT',
                      '${(fp.progressPercent * 100).round()}%',
                    ),
                  ],
                ),
              ),
              pw.SizedBox(height: 22),

              // Legal VEFA Notice
              pw.Text(
                _safe(
                  'Attestation conforme au cadre reglementaire de la Vente en l\'Etat Futur d\'Achevement (VEFA - Loi n 107-12). Ce document est delivre par BaytImmo Prestige pour faire valoir ce que de droit. Titre Foncier Mere : TF 34 603/M - Arrondissement Menara, Marrakech.',
                ),
                style: const pw.TextStyle(
                  fontSize: 8.5,
                  color: _textMuted,
                  lineSpacing: 3,
                ),
              ),
              pw.Spacer(),

              // Signature Footer
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Column(
                    crossAxisAlignment: pw.CrossAxisAlignment.start,
                    children: [
                      pw.Text(
                        'Bureau de Vente Menara',
                        style: pw.TextStyle(
                          fontSize: 9,
                          fontWeight: pw.FontWeight.bold,
                          color: _textDark,
                        ),
                      ),
                      pw.Text(
                        'Quartier Rahham, Lot B5 - Rue Ibn Batouta',
                        style: const pw.TextStyle(
                          fontSize: 8.5,
                          color: _textMuted,
                        ),
                      ),
                      pw.Text(
                        'Tel : +212 6 65 64 43 91 | bayt-immo.com',
                        style: const pw.TextStyle(
                          fontSize: 8.5,
                          color: _textMuted,
                        ),
                      ),
                    ],
                  ),
                  pw.Container(
                    width: 170,
                    padding: const pw.EdgeInsets.all(10),
                    decoration: pw.BoxDecoration(
                      border: pw.Border.all(color: _gold),
                      borderRadius: pw.BorderRadius.circular(6),
                    ),
                    child: pw.Column(
                      children: [
                        pw.Text(
                          'DIRECTION BAYTIMMO PRESTIGE',
                          style: pw.TextStyle(
                            fontSize: 7.5,
                            fontWeight: pw.FontWeight.bold,
                            color: _darkGreen,
                          ),
                        ),
                        pw.SizedBox(height: 18),
                        pw.Text(
                          'Statut : PAYE & VALIDE',
                          style: pw.TextStyle(
                            fontSize: 8.5,
                            fontWeight: pw.FontWeight.bold,
                            color: PdfColors.green800,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );

    return doc.save();
  }

  /// Generates official Apartment Brochure PDF bytes (with optional 2D plan).
  static Future<Uint8List> buildLotBrochurePdf({
    required ResidenceLot lot,
    Uint8List? planPngBytes,
  }) async {
    final doc = pw.Document(
      title: 'Fiche Officielle ${lot.id} - Jardins de Bali Marrakech',
      author: 'BaytImmo Groupe Immobilier',
    );

    doc.addPage(
      pw.Page(
        pageFormat: PdfPageFormat.a4,
        margin: const pw.EdgeInsets.all(26),
        build: (context) {
          return pw.Column(
            crossAxisAlignment: pw.CrossAxisAlignment.start,
            children: [
              // Header
              pw.Container(
                width: double.infinity,
                padding: const pw.EdgeInsets.all(20),
                decoration: pw.BoxDecoration(
                  color: _darkGreen,
                  borderRadius: pw.BorderRadius.circular(10),
                  border: pw.Border.all(color: _gold, width: 1.2),
                ),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    pw.Expanded(
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Text(
                            'FICHE ARCHITECTURALE OFFICIELLE - BAYTIMMO',
                            style: pw.TextStyle(
                              fontSize: 8.5,
                              fontWeight: pw.FontWeight.bold,
                              letterSpacing: 1.8,
                              color: _gold,
                            ),
                          ),
                          pw.SizedBox(height: 5),
                          pw.Text(
                            _safe(lot.title),
                            style: pw.TextStyle(
                              font: pw.Font.timesBold(),
                              fontSize: 19,
                              color: PdfColors.white,
                            ),
                          ),
                          pw.SizedBox(height: 3),
                          pw.Text(
                            _safe(
                              'Les Jardins de Bali Marrakech Menara | ${lot.floorName} | TF 34 603/M',
                            ),
                            style: const pw.TextStyle(
                              fontSize: 8.5,
                              color: PdfColors.grey300,
                            ),
                          ),
                        ],
                      ),
                    ),
                    pw.Container(
                      padding: const pw.EdgeInsets.symmetric(
                        horizontal: 11,
                        vertical: 6,
                      ),
                      decoration: pw.BoxDecoration(
                        color: _gold,
                        borderRadius: pw.BorderRadius.circular(6),
                      ),
                      child: pw.Text(
                        _safe(lot.status.toUpperCase()),
                        style: pw.TextStyle(
                          fontSize: 9,
                          fontWeight: pw.FontWeight.bold,
                          color: _darkGreen,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              pw.SizedBox(height: 14),

              // Key Specs Bar
              pw.Container(
                padding: const pw.EdgeInsets.symmetric(
                  horizontal: 14,
                  vertical: 12,
                ),
                decoration: pw.BoxDecoration(
                  color: _cream,
                  borderRadius: pw.BorderRadius.circular(8),
                  border: pw.Border.all(color: _border),
                ),
                child: pw.Row(
                  mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                  children: [
                    _summaryCol('SURFACE', _safe(lot.surfaceFormatted)),
                    _summaryCol('TYPOLOGIE', _safe(lot.category)),
                    _summaryCol('ETAGE', _safe(lot.floorName)),
                    _summaryCol('TARIF', 'Sur demande'),
                  ],
                ),
              ),
              pw.SizedBox(height: 14),

              // Architectural 2D Plan Image (when decoded)
              if (planPngBytes != null) ...[
                pw.Text(
                  'PLAN ARCHITECTURAL 2D DU LOT',
                  style: pw.TextStyle(
                    fontSize: 8.5,
                    fontWeight: pw.FontWeight.bold,
                    letterSpacing: 1.4,
                    color: _textMuted,
                  ),
                ),
                pw.SizedBox(height: 6),
                pw.Container(
                  height: 310,
                  width: double.infinity,
                  padding: const pw.EdgeInsets.all(8),
                  decoration: pw.BoxDecoration(
                    color: PdfColors.white,
                    borderRadius: pw.BorderRadius.circular(8),
                    border: pw.Border.all(color: _border),
                  ),
                  child: pw.Center(
                    child: pw.Image(
                      pw.MemoryImage(planPngBytes),
                      fit: pw.BoxFit.contain,
                    ),
                  ),
                ),
                pw.SizedBox(height: 14),
              ],

              // Composition & Prestations
              pw.Row(
                crossAxisAlignment: pw.CrossAxisAlignment.start,
                children: [
                  pw.Expanded(
                    child: pw.Container(
                      padding: const pw.EdgeInsets.all(12),
                      decoration: pw.BoxDecoration(
                        color: _cream,
                        borderRadius: pw.BorderRadius.circular(8),
                        border: pw.Border.all(color: _border),
                      ),
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Text(
                            'COMPOSITION & ATOUTS',
                            style: pw.TextStyle(
                              fontSize: 8,
                              fontWeight: pw.FontWeight.bold,
                              letterSpacing: 1.3,
                              color: _gold,
                            ),
                          ),
                          pw.SizedBox(height: 6),
                          pw.Text(
                            _safe(lot.roomsText),
                            style: pw.TextStyle(
                              fontSize: 9.5,
                              fontWeight: pw.FontWeight.bold,
                              color: _textDark,
                            ),
                          ),
                          pw.SizedBox(height: 4),
                          ...lot.features.take(5).map(
                                (f) => pw.Padding(
                                  padding: const pw.EdgeInsets.only(bottom: 2.5),
                                  child: pw.Text(
                                    '- ${_safe(f)}',
                                    style: const pw.TextStyle(
                                      fontSize: 8.5,
                                      color: _textMuted,
                                    ),
                                  ),
                                ),
                              ),
                        ],
                      ),
                    ),
                  ),
                  pw.SizedBox(width: 10),
                  pw.Expanded(
                    child: pw.Container(
                      padding: const pw.EdgeInsets.all(12),
                      decoration: pw.BoxDecoration(
                        color: _cream,
                        borderRadius: pw.BorderRadius.circular(8),
                        border: pw.Border.all(color: _border),
                      ),
                      child: pw.Column(
                        crossAxisAlignment: pw.CrossAxisAlignment.start,
                        children: [
                          pw.Text(
                            'ECHEANCIER VEFA (LOI 107-12)',
                            style: pw.TextStyle(
                              fontSize: 8,
                              fontWeight: pw.FontWeight.bold,
                              letterSpacing: 1.3,
                              color: _gold,
                            ),
                          ),
                          pw.SizedBox(height: 6),
                          _vefaLine('1. Reservation / Contrat preliminaire', '20%'),
                          _vefaLine('2. Achevement des fondations', '20%'),
                          _vefaLine('3. Gros oeuvre & facades', '30%'),
                          _vefaLine('4. Finitions & remise des cles', '30%'),
                          pw.SizedBox(height: 5),
                          pw.Text(
                            'VNA non requise - Acquisition 100% ouverte aux etrangers.',
                            style: pw.TextStyle(
                              fontSize: 8,
                              fontWeight: pw.FontWeight.bold,
                              color: _darkGreen,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
              pw.Spacer(),

              // Footer Contact
              pw.Divider(color: _gold, thickness: 0.7),
              pw.Row(
                mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
                children: [
                  pw.Text(
                    'Les Jardins de Bali - Quartier Rahham, Lot B5, Rue Ibn Batouta, Menara Marrakech',
                    style: const pw.TextStyle(fontSize: 8, color: _textMuted),
                  ),
                  pw.Text(
                    'WhatsApp / Tel : +212 6 65 64 43 91',
                    style: pw.TextStyle(
                      fontSize: 8.5,
                      fontWeight: pw.FontWeight.bold,
                      color: _darkGreen,
                    ),
                  ),
                ],
              ),
            ],
          );
        },
      ),
    );

    return doc.save();
  }

  static Future<void> openPaymentReceiptPdf({
    required UserAccount user,
    required PaymentRecord payment,
    ResidenceLot? lot,
  }) async {
    final bytes = await buildPaymentReceiptPdf(
      user: user,
      payment: payment,
      lot: lot,
    );
    await Printing.layoutPdf(
      name: 'Recu_${payment.receiptRef}_JardinsDeBali.pdf',
      onLayout: (_) async => bytes,
    );
  }

  static Future<void> openLotBrochurePdf({
    required ResidenceLot lot,
  }) async {
    final planBytes = await _loadAssetAsPng(lot.assets.planLocalPath);
    final bytes = await buildLotBrochurePdf(
      lot: lot,
      planPngBytes: planBytes,
    );
    await Printing.layoutPdf(
      name: 'Fiche_${lot.id.replaceAll(' ', '_')}_JardinsDeBali.pdf',
      onLayout: (_) async => bytes,
    );
  }

  static pw.Widget _cellHeader(String text, {bool alignRight = false}) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(horizontal: 8, vertical: 7),
      child: pw.Text(
        text,
        textAlign: alignRight ? pw.TextAlign.right : pw.TextAlign.left,
        style: pw.TextStyle(
          fontSize: 8.5,
          fontWeight: pw.FontWeight.bold,
          color: _gold,
        ),
      ),
    );
  }

  static pw.Widget _cellBody(
    String text, {
    bool bold = false,
    bool alignRight = false,
  }) {
    return pw.Padding(
      padding: const pw.EdgeInsets.symmetric(horizontal: 8, vertical: 9),
      child: pw.Text(
        text,
        textAlign: alignRight ? pw.TextAlign.right : pw.TextAlign.left,
        style: pw.TextStyle(
          fontSize: 9,
          fontWeight: bold ? pw.FontWeight.bold : pw.FontWeight.normal,
          color: _textDark,
        ),
      ),
    );
  }

  static pw.Widget _summaryCol(String label, String value) {
    return pw.Column(
      crossAxisAlignment: pw.CrossAxisAlignment.start,
      children: [
        pw.Text(
          label,
          style: pw.TextStyle(
            fontSize: 7,
            fontWeight: pw.FontWeight.bold,
            color: _textMuted,
          ),
        ),
        pw.SizedBox(height: 3),
        pw.Text(
          value,
          style: pw.TextStyle(
            fontSize: 10,
            fontWeight: pw.FontWeight.bold,
            color: _darkGreen,
          ),
        ),
      ],
    );
  }

  static pw.Widget _vefaLine(String step, String pct) {
    return pw.Padding(
      padding: const pw.EdgeInsets.only(bottom: 3),
      child: pw.Row(
        mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
        children: [
          pw.Expanded(
            child: pw.Text(
              step,
              style: const pw.TextStyle(fontSize: 8.5, color: _textMuted),
            ),
          ),
          pw.Text(
            pct,
            style: pw.TextStyle(
              fontSize: 8.5,
              fontWeight: pw.FontWeight.bold,
              color: _darkGreen,
            ),
          ),
        ],
      ),
    );
  }
}
