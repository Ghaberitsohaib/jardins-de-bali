// =========================================================================
// JARDINS DE BALI MARRAKECH — OFFICIAL FLUTTER MOBILE APPLICATION
// Promoter: BaytImmo Groupe Immobilier | Architect: Cabinet AMA Architecture
// Architecture: 4 Principal Navigation Tabs, Offline-First, App Store Ready
// =========================================================================

import 'dart:ui' show PointerDeviceKind;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/business_screen.dart';
import 'screens/contact_vip_screen.dart';
import 'screens/home_screen.dart';
import 'screens/residences_screen.dart';
import 'state/app_state.dart';
import 'theme/imperial_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: ImperialColors.primary,
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );

  final appState = AppState();
  await appState.initialize();

  runApp(JardinsDeBaliApp(appState: appState));
}

class JardinsDeBaliApp extends StatelessWidget {
  final AppState appState;

  const JardinsDeBaliApp({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Jardins de Bali Marrakech',
      debugShowCheckedModeBanner: false,
      scrollBehavior: const _AppScrollBehavior(),
      theme: ImperialTheme.themeData,
      home: MainNavigationShell(appState: appState),
    );
  }
}

class _AppScrollBehavior extends MaterialScrollBehavior {
  const _AppScrollBehavior();

  @override
  Set<PointerDeviceKind> get dragDevices => const {
        PointerDeviceKind.touch,
        PointerDeviceKind.mouse,
        PointerDeviceKind.trackpad,
        PointerDeviceKind.stylus,
        PointerDeviceKind.unknown,
      };
}

class MainNavigationShell extends StatefulWidget {
  final AppState appState;

  const MainNavigationShell({super.key, required this.appState});

  @override
  State<MainNavigationShell> createState() => _MainNavigationShellState();
}

class _MainNavigationShellState extends State<MainNavigationShell> {
  late final List<Widget> _screens;

  @override
  void initState() {
    super.initState();
    _screens = [
      HomeScreen(appState: widget.appState),
      ResidencesScreen(appState: widget.appState),
      BusinessScreen(appState: widget.appState),
      ContactVipScreen(appState: widget.appState),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: widget.appState,
      builder: (context, _) {
        // ENTRANCE / SPLASH WITH OFFICIAL BAYTIMMO LOGO
        if (widget.appState.isLoading) {
          return Scaffold(
            backgroundColor: ImperialColors.primary,
            body: Center(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 32),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'BAYTIMMO',
                      style: ImperialTheme.displayStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        letterSpacing: 4.5,
                      ),
                    ).animate().fadeIn(duration: 500.ms).slideY(begin: 0.15, end: 0),
                    const SizedBox(height: 6),
                    Text(
                      'GROUPE IMMOBILIER',
                      style: ImperialTheme.bodyStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: ImperialColors.accent,
                        letterSpacing: 2.4,
                      ),
                    ).animate().fadeIn(delay: 200.ms, duration: 500.ms),
                    const SizedBox(height: 24),
                    Container(
                      width: 48,
                      height: 1.5,
                      color: ImperialColors.accent.withValues(alpha: 0.5),
                    ).animate().scaleX(delay: 350.ms, duration: 400.ms),
                    const SizedBox(height: 24),
                    Text(
                      'JARDINS DE BALI',
                      style: ImperialTheme.displayStyle(
                        fontSize: 22,
                        color: ImperialColors.accentLight,
                        letterSpacing: 3,
                      ),
                    ).animate().fadeIn(delay: 450.ms, duration: 500.ms),
                    const SizedBox(height: 6),
                    Text(
                      'MARRAKECH MENARA • TITRE FONCIER PURIFIÉ',
                      style: ImperialTheme.bodyStyle(
                        fontSize: 11,
                        color: Colors.white60,
                        letterSpacing: 1.5,
                      ),
                    ),
                    const SizedBox(height: 28),
                    const SizedBox(
                      width: 28,
                      height: 28,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.2,
                        valueColor: AlwaysStoppedAnimation<Color>(ImperialColors.accent),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }

        if (widget.appState.error != null) {
          return Scaffold(
            backgroundColor: ImperialColors.background,
            body: Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.error_outline_rounded, color: ImperialColors.reserved, size: 48),
                    const SizedBox(height: 12),
                    Text(
                      'Erreur d\'initialisation',
                      style: ImperialTheme.displayStyle(fontSize: 18),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      widget.appState.error!,
                      textAlign: TextAlign.center,
                      style: ImperialTheme.bodyStyle(color: ImperialColors.textSecondary),
                    ),
                    const SizedBox(height: 16),
                    ElevatedButton(
                      onPressed: () => widget.appState.initialize(),
                      child: const Text('Réessayer'),
                    ),
                  ],
                ),
              ),
            ),
          );
        }

        final rawIdx = widget.appState.currentTabIndex;
        final currentIdx = rawIdx >= _screens.length ? 0 : rawIdx;

        return Scaffold(
          backgroundColor: ImperialColors.background,
          body: Stack(
            children: [
              // Screen Body
              IndexedStack(
                index: currentIdx,
                children: _screens,
              ),

              // Haute Joaillerie Bottom Navigation Bar (Style 8: Spotlight & Losange ◆)
              Positioned(
                left: 0,
                right: 0,
                bottom: 0,
                child: _buildLuxuryBottomBar(currentIdx),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLuxuryBottomBar(int selectedIndex) {
    final navItems = [
      (Icons.home_rounded, Icons.home_outlined, 'ACCUEIL'),
      (Icons.apartment_rounded, Icons.apartment_outlined, 'RÉSIDENCES'),
      (Icons.storefront_rounded, Icons.storefront_outlined, 'COMMERCES'),
      (Icons.headset_mic_rounded, Icons.headset_mic_outlined, 'CONTACT'),
    ];

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFFAF8F2),
        border: const Border(
          top: BorderSide(
            color: Color(0xFFDDD4C4),
            width: 1,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 60,
          child: Row(
            children: List.generate(navItems.length, (idx) {
              final item = navItems[idx];
              final isSelected = selectedIndex == idx;
              return Expanded(
                child: MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: () {
                      HapticFeedback.selectionClick();
                      widget.appState.setTabIndex(idx);
                    },
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        AnimatedScale(
                          scale: isSelected ? 1.06 : 1.0,
                          duration: const Duration(milliseconds: 220),
                          curve: Curves.easeOutCubic,
                          child: Icon(
                            isSelected ? item.$1 : item.$2,
                            size: 20,
                            color: isSelected
                                ? const Color(0xFF9E7D4E)
                                : const Color(0xFF8C9289),
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.$3,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.plusJakartaSans(
                            fontSize: 8.8,
                            fontWeight:
                                isSelected ? FontWeight.w800 : FontWeight.w600,
                            letterSpacing: 1.3,
                            color: isSelected
                                ? const Color(0xFF111710)
                                : const Color(0xFF8C9289),
                          ),
                        ),
                        const SizedBox(height: 4),
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 260),
                          curve: Curves.easeOutCubic,
                          width: isSelected ? 22 : 0,
                          height: 2,
                          decoration: BoxDecoration(
                            color: const Color(0xFFB8945F),
                            borderRadius: BorderRadius.circular(99),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}
