import 'package:flutter_test/flutter_test.dart';
import 'package:jardins_de_bali_app/main.dart';
import 'package:jardins_de_bali_app/state/app_state.dart';

void main() {
  testWidgets('App initialization smoke test', (WidgetTester tester) async {
    final appState = AppState();
    await tester.pumpWidget(JardinsDeBaliApp(appState: appState));
    await tester.pump(const Duration(seconds: 3));

    expect(find.byType(JardinsDeBaliApp), findsOneWidget);
  });
}
