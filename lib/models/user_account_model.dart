// =========================================================================
// JARDINS DE BALI — CLIENT PORTAL & ADMIN DOMAIN MODELS
// Modular Phase 1 (SharedPreferences) → Ready for Phase 2 (Supabase/Firebase)
// =========================================================================

import 'dart:convert';

enum UserRole { client, admin }

class PaymentRecord {
  final String id;
  final String date;
  final double amount;
  final String trancheLabel;
  final String method;
  final String status;
  final String receiptRef;

  const PaymentRecord({
    required this.id,
    required this.date,
    required this.amount,
    required this.trancheLabel,
    required this.method,
    required this.status,
    required this.receiptRef,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'date': date,
        'amount': amount,
        'trancheLabel': trancheLabel,
        'method': method,
        'status': status,
        'receiptRef': receiptRef,
      };

  factory PaymentRecord.fromJson(Map<String, dynamic> json) {
    return PaymentRecord(
      id: json['id']?.toString() ?? '',
      date: json['date']?.toString() ?? '',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      trancheLabel: json['trancheLabel']?.toString() ?? 'Versement',
      method: json['method']?.toString() ?? 'Virement bancaire',
      status: json['status']?.toString() ?? 'Payé',
      receiptRef: json['receiptRef']?.toString() ?? '',
    );
  }
}

class ClientFinancialProfile {
  final double totalPrice;
  final List<PaymentRecord> payments;

  const ClientFinancialProfile({
    this.totalPrice = 0.0,
    this.payments = const [],
  });

  double get paidAmount =>
      payments.fold(0.0, (sum, p) => sum + (p.status == 'Payé' ? p.amount : 0.0));

  double get remainingAmount {
    final diff = totalPrice - paidAmount;
    return diff > 0 ? diff : 0.0;
  }

  /// Capped cleanly at [0.0, 1.0] even in edge cases of overpayment or 0 price.
  double get progressPercent {
    if (totalPrice <= 0) return 0.0;
    final ratio = paidAmount / totalPrice;
    if (ratio < 0.0) return 0.0;
    if (ratio > 1.0) return 1.0;
    return ratio;
  }

  /// Official 4-milestone VEFA schedule (20% / 20% / 30% / 30%):
  /// returns how many milestones are fully completed (0..4).
  int get completedVefaMilestones {
    final pct = progressPercent * 100.0;
    if (pct >= 99.9) return 4;
    if (pct >= 70.0) return 3;
    if (pct >= 40.0) return 2;
    if (pct >= 20.0) return 1;
    return 0;
  }

  ClientFinancialProfile copyWith({
    double? totalPrice,
    List<PaymentRecord>? payments,
  }) {
    return ClientFinancialProfile(
      totalPrice: totalPrice ?? this.totalPrice,
      payments: payments ?? this.payments,
    );
  }

  Map<String, dynamic> toJson() => {
        'totalPrice': totalPrice,
        'payments': payments.map((p) => p.toJson()).toList(),
      };

  factory ClientFinancialProfile.fromJson(Map<String, dynamic> json) {
    final rawPayments = json['payments'] as List<dynamic>? ?? [];
    return ClientFinancialProfile(
      totalPrice: (json['totalPrice'] as num?)?.toDouble() ?? 0.0,
      payments: rawPayments
          .map((e) => PaymentRecord.fromJson(e as Map<String, dynamic>))
          .toList(),
    );
  }
}

class UserAccount {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String password;
  final UserRole role;
  final String? assignedLotId;
  final ClientFinancialProfile financialProfile;

  const UserAccount({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.password,
    required this.role,
    this.assignedLotId,
    this.financialProfile = const ClientFinancialProfile(),
  });

  bool get isAdmin => role == UserRole.admin;
  bool get hasAssignedLot =>
      assignedLotId != null && assignedLotId!.trim().isNotEmpty;

  UserAccount copyWith({
    String? id,
    String? name,
    String? email,
    String? phone,
    String? password,
    UserRole? role,
    String? assignedLotId,
    bool clearAssignedLot = false,
    ClientFinancialProfile? financialProfile,
  }) {
    return UserAccount(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      password: password ?? this.password,
      role: role ?? this.role,
      assignedLotId:
          clearAssignedLot ? null : (assignedLotId ?? this.assignedLotId),
      financialProfile: financialProfile ?? this.financialProfile,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'phone': phone,
        'password': password,
        'role': role.name,
        'assignedLotId': assignedLotId,
        'financialProfile': financialProfile.toJson(),
      };

  factory UserAccount.fromJson(Map<String, dynamic> json) {
    final roleStr = json['role']?.toString() ?? 'client';
    return UserAccount(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      phone: json['phone']?.toString() ?? '',
      password: json['password']?.toString() ?? '',
      role: roleStr == 'admin' ? UserRole.admin : UserRole.client,
      assignedLotId: json['assignedLotId']?.toString(),
      financialProfile: json['financialProfile'] is Map<String, dynamic>
          ? ClientFinancialProfile.fromJson(
              json['financialProfile'] as Map<String, dynamic>,
            )
          : const ClientFinancialProfile(),
    );
  }

  static String encodeList(List<UserAccount> accounts) =>
      json.encode(accounts.map((a) => a.toJson()).toList());

  static List<UserAccount> decodeList(String raw) {
    final list = json.decode(raw) as List<dynamic>;
    return list
        .map((e) => UserAccount.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}

class VisitBooking {
  final String id;
  final String userId;
  final String clientName;
  final String clientPhone;
  final String date;
  final String timeSlot;
  final String lotInterest;
  final String status; // 'En attente', 'Confirmé', 'Terminé'
  final String notes;

  const VisitBooking({
    required this.id,
    required this.userId,
    required this.clientName,
    required this.clientPhone,
    required this.date,
    required this.timeSlot,
    this.lotInterest = '',
    this.status = 'En attente',
    this.notes = '',
  });

  VisitBooking copyWith({String? status, String? notes}) => VisitBooking(
        id: id,
        userId: userId,
        clientName: clientName,
        clientPhone: clientPhone,
        date: date,
        timeSlot: timeSlot,
        lotInterest: lotInterest,
        status: status ?? this.status,
        notes: notes ?? this.notes,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'userId': userId,
        'clientName': clientName,
        'clientPhone': clientPhone,
        'date': date,
        'timeSlot': timeSlot,
        'lotInterest': lotInterest,
        'status': status,
        'notes': notes,
      };

  factory VisitBooking.fromJson(Map<String, dynamic> json) => VisitBooking(
        id: json['id']?.toString() ?? '',
        userId: json['userId']?.toString() ?? '',
        clientName: json['clientName']?.toString() ?? '',
        clientPhone: json['clientPhone']?.toString() ?? '',
        date: json['date']?.toString() ?? '',
        timeSlot: json['timeSlot']?.toString() ?? '',
        lotInterest: json['lotInterest']?.toString() ?? '',
        status: json['status']?.toString() ?? 'En attente',
        notes: json['notes']?.toString() ?? '',
      );

  static String encodeList(List<VisitBooking> list) =>
      json.encode(list.map((v) => v.toJson()).toList());

  static List<VisitBooking> decodeList(String raw) {
    final list = json.decode(raw) as List<dynamic>;
    return list
        .map((e) => VisitBooking.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}

class ChantierProgress {
  final int progressPercent; // 0..100
  final String currentPhase;
  final String lastUpdate;

  const ChantierProgress({
    this.progressPercent = 65,
    this.currentPhase = 'Gros Œuvre & Façades Ondulantes R+5',
    this.lastUpdate = 'Novembre 2026',
  });

  static const List<String> officialPhases = [
    'Terrassement & 2 Sous-sols',
    'Gros Œuvre & Façades Ondulantes R+5',
    'Finitions & Travertin',
    'Livraison & Remise des Clés',
  ];

  int get completedPhases {
    if (progressPercent >= 100) return 4;
    if (progressPercent >= 75) return 3;
    if (progressPercent >= 45) return 2;
    if (progressPercent >= 15) return 1;
    return 0;
  }

  Map<String, dynamic> toJson() => {
        'progressPercent': progressPercent,
        'currentPhase': currentPhase,
        'lastUpdate': lastUpdate,
      };

  factory ChantierProgress.fromJson(Map<String, dynamic> json) =>
      ChantierProgress(
        progressPercent: (json['progressPercent'] as num?)?.toInt().clamp(0, 100) ?? 65,
        currentPhase: json['currentPhase']?.toString() ??
            'Gros Œuvre & Façades Ondulantes R+5',
        lastUpdate: json['lastUpdate']?.toString() ?? 'Novembre 2026',
      );

  String encode() => json.encode(toJson());
  static ChantierProgress decode(String raw) =>
      ChantierProgress.fromJson(json.decode(raw) as Map<String, dynamic>);
}

/// Formats Moroccan Dirham amounts cleanly: e.g. 1850000 -> "1 850 000 DH"
String formatMadAmount(double amount) {
  final rounded = amount.round();
  final digits = rounded.abs().toString();
  final buf = StringBuffer();
  for (int i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 == 0) {
      buf.write(' ');
    }
    buf.write(digits[i]);
  }
  final prefix = rounded < 0 ? '-' : '';
  return '$prefix$buf DH';
}
