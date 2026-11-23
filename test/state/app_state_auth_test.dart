import 'package:flutter_test/flutter_test.dart';
import 'package:jardins_de_bali_app/models/user_account_model.dart';
import 'package:jardins_de_bali_app/state/app_state.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('AppState Authentication & Persistence', () {
    test('seeds demo client and admin accounts and persists session across restarts', () async {
      final state1 = AppState();
      await state1.initializeAuthOnly();

      expect(state1.isLoggedIn, false);
      expect(state1.clientAccounts.isNotEmpty, true);

      final loginOk = await state1.login('karim@client.ma', 'client123');
      expect(loginOk, true);
      expect(state1.isLoggedIn, true);
      expect(state1.isAdmin, false);
      expect(state1.currentUser?.email, 'karim@client.ma');
      expect(state1.currentUser?.hasAssignedLot, true);

      // Simulate fresh app restart
      final state2 = AppState();
      await state2.initializeAuthOnly();
      expect(state2.isLoggedIn, true);
      expect(state2.currentUser?.email, 'karim@client.ma');
    });

    test('registers a new unassigned client and rejects duplicate email', () async {
      final state = AppState();
      await state.initializeAuthOnly();

      final ok = await state.register(
        name: 'Youssef Amrani',
        email: 'youssef@client.ma',
        phone: '+212 6 62 00 11 22',
        password: 'secret',
      );
      expect(ok, true);
      expect(state.isLoggedIn, true);
      expect(state.currentUser?.hasAssignedLot, false);

      await state.logout();
      expect(state.isLoggedIn, false);

      final dup = await state.register(
        name: 'Duplicate',
        email: 'youssef@client.ma',
        phone: '+212 6 00 00 00 00',
        password: 'other',
      );
      expect(dup, false);
    });

    test('prevents non-admin client from assigning lots or recording payments', () async {
      final state = AppState();
      await state.initializeAuthOnly();
      await state.login('karim@client.ma', 'client123');
      final karimId = state.currentUser!.id;

      final assigned = await state.assignLotToClient(karimId, 'APP 50', 2000000);
      expect(assigned, false);

      final recorded = await state.recordPayment(
        karimId,
        const PaymentRecord(
          id: 'hack-1',
          date: '2026-11-23',
          amount: 500000,
          trancheLabel: 'Hack',
          method: 'Cash',
          status: 'Payé',
          receiptRef: 'REC-HACK',
        ),
      );
      expect(recorded, false);
    });

    test('admin assigns apartment and records payment with immediate recalculation and persistence', () async {
      final state = AppState();
      await state.initializeAuthOnly();

      // Register a fresh client first
      await state.register(
        name: 'Nadia Tazi',
        email: 'nadia@client.ma',
        phone: '+212 6 70 11 22 33',
        password: 'pass',
      );
      final nadiaId = state.currentUser!.id;
      await state.logout();

      // Login as Admin
      final adminOk = await state.login('admin@bayt-immo.com', 'admin123');
      expect(adminOk, true);
      expect(state.isAdmin, true);

      // Assign APP 12 for 1,600,000 DH
      final assigned = await state.assignLotToClient(nadiaId, 'APP 12', 1600000);
      expect(assigned, true);

      // Record payment of 400,000 DH (25%)
      final paid = await state.recordPayment(
        nadiaId,
        const PaymentRecord(
          id: 'pay-nadia-1',
          date: '2026-11-23',
          amount: 400000,
          trancheLabel: 'Tranche 1 : Réservation (20%)',
          method: 'Virement bancaire',
          status: 'Payé',
          receiptRef: 'REC-2026-101',
        ),
      );
      expect(paid, true);

      // Reload state and verify Nadia sees her assigned lot & updated balance
      final restarted = AppState();
      await restarted.initializeAuthOnly();
      await restarted.logout();
      await restarted.login('nadia@client.ma', 'pass');

      expect(restarted.currentUser?.assignedLotId, 'APP 12');
      expect(restarted.currentUser?.financialProfile.totalPrice, 1600000);
      expect(restarted.currentUser?.financialProfile.paidAmount, 400000);
      expect(restarted.currentUser?.financialProfile.remainingAmount, 1200000);
      expect(restarted.currentUser?.financialProfile.progressPercent, closeTo(0.25, 0.001));
    });

    test('client books VIP visit and admin confirms it with persistence', () async {
      final state = AppState();
      await state.initializeAuthOnly();
      await state.login('salma@client.ma', 'client123');

      final booked = await state.bookVisit(
        date: '2026-12-05',
        timeSlot: '11h30',
        lotInterest: 'APP 10',
      );
      expect(booked, true);
      expect(state.myVisits.any((v) => v.date == '2026-12-05' && v.status == 'En attente'), true);

      final visitId = state.myVisits.firstWhere((v) => v.date == '2026-12-05').id;
      // Client cannot confirm their own visit
      expect(await state.updateVisitStatus(visitId, 'Confirmé'), false);

      // Admin confirms visit
      await state.logout();
      await state.login('admin@bayt-immo.com', 'admin123');
      expect(await state.updateVisitStatus(visitId, 'Confirmé'), true);

      // Reload & verify Salma sees Confirmé
      final reloaded = AppState();
      await reloaded.initializeAuthOnly();
      await reloaded.logout();
      await reloaded.login('salma@client.ma', 'client123');
      expect(reloaded.myVisits.firstWhere((v) => v.id == visitId).status, 'Confirmé');
    });

    test('admin updates chantier progress and non-admin is rejected', () async {
      final state = AppState();
      await state.initializeAuthOnly();
      await state.login('karim@client.ma', 'client123');

      expect(
        await state.updateChantierProgress(
          progressPercent: 90,
          currentPhase: 'Finitions & Travertin',
        ),
        false,
      );

      await state.logout();
      await state.login('admin@bayt-immo.com', 'admin123');
      expect(
        await state.updateChantierProgress(
          progressPercent: 80,
          currentPhase: 'Finitions & Travertin',
        ),
        true,
      );

      final reloaded = AppState();
      await reloaded.initializeAuthOnly();
      expect(reloaded.chantierProgress.progressPercent, 80);
      expect(reloaded.chantierProgress.currentPhase, 'Finitions & Travertin');
    });
  });
}
