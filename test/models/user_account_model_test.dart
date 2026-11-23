import 'package:flutter_test/flutter_test.dart';
import 'package:jardins_de_bali_app/models/user_account_model.dart';

void main() {
  group('ClientFinancialProfile', () {
    test('calculates paidAmount, remainingAmount, and progressPercent accurately', () {
      final profile = ClientFinancialProfile(
        totalPrice: 1850000,
        payments: [
          PaymentRecord(
            id: 'pay-1',
            date: '2026-03-15',
            amount: 370000,
            trancheLabel: 'Tranche 1 : Réservation (20%)',
            method: 'Virement bancaire',
            status: 'Payé',
            receiptRef: 'REC-2026-001',
          ),
          PaymentRecord(
            id: 'pay-2',
            date: '2026-06-20',
            amount: 370000,
            trancheLabel: 'Tranche 2 : Fondations (20%)',
            method: 'Chèque certifié',
            status: 'Payé',
            receiptRef: 'REC-2026-002',
          ),
        ],
      );

      expect(profile.paidAmount, 740000);
      expect(profile.remainingAmount, 1110000);
      expect(profile.progressPercent, closeTo(0.40, 0.001));
    });

    test('caps progressPercent at 1.0 and clamps remainingAmount at 0 on overpayment', () {
      final profile = ClientFinancialProfile(
        totalPrice: 1000000,
        payments: [
          PaymentRecord(
            id: 'pay-1',
            date: '2026-05-01',
            amount: 1200000,
            trancheLabel: 'Solde intégral',
            method: 'Virement bancaire',
            status: 'Payé',
            receiptRef: 'REC-2026-099',
          ),
        ],
      );

      expect(profile.paidAmount, 1200000);
      expect(profile.remainingAmount, 0);
      expect(profile.progressPercent, 1.0);
    });

    test('handles zero totalPrice safely without NaN', () {
      const profile = ClientFinancialProfile(totalPrice: 0, payments: []);
      expect(profile.paidAmount, 0);
      expect(profile.remainingAmount, 0);
      expect(profile.progressPercent, 0.0);
    });
  });

  group('UserAccount serialization', () {
    test('round-trips UserAccount with financialProfile through JSON', () {
      final account = UserAccount(
        id: 'usr-1',
        name: 'Karim Benjelloun',
        email: 'karim@client.ma',
        phone: '+212 6 61 12 34 56',
        password: 'client123',
        role: UserRole.client,
        assignedLotId: 'APP 1',
        financialProfile: ClientFinancialProfile(
          totalPrice: 1850000,
          payments: [
            PaymentRecord(
              id: 'pay-1',
              date: '2026-03-15',
              amount: 370000,
              trancheLabel: 'Tranche 1 : Réservation (20%)',
              method: 'Virement bancaire',
              status: 'Payé',
              receiptRef: 'REC-2026-001',
            ),
          ],
        ),
      );

      final restored = UserAccount.fromJson(account.toJson());
      expect(restored.id, account.id);
      expect(restored.name, account.name);
      expect(restored.email, account.email);
      expect(restored.phone, account.phone);
      expect(restored.role, UserRole.client);
      expect(restored.assignedLotId, 'APP 1');
      expect(restored.financialProfile.totalPrice, 1850000);
      expect(restored.financialProfile.payments.length, 1);
      expect(restored.financialProfile.paidAmount, 370000);
    });
  });
}
