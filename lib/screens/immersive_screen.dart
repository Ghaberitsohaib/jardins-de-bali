// =========================================================================
// JARDINS DE BALI — IMMERSIVE SCREEN (DEPRECATED PER CLIENT DIRECTIVE)
// 3D and 360 features were completely removed from navigation.
// =========================================================================

import 'package:flutter/material.dart';
import '../state/app_state.dart';

class ImmersiveScreen extends StatelessWidget {
  final AppState appState;

  const ImmersiveScreen({super.key, required this.appState});

  @override
  Widget build(BuildContext context) {
    return const SizedBox.shrink();
  }
}
