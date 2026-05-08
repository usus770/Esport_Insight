"""Run tests from within the container."""
import sys
import os
sys.path.insert(0, '/app')

# Import and run tests
print("Running test_features.py...")
try:
    from tests.test_features import test_build_match_features
    test_build_match_features()
    print("✅ test_features.py passed")
except Exception as e:
    print(f"❌ test_features.py failed: {e}")
    sys.exit(1)

print("\nRunning test_meta.py...")
try:
    from tests.test_meta import test_meta_features
    test_meta_features()
    print("✅ test_meta.py passed")
except Exception as e:
    print(f"❌ test_meta.py failed: {e}")
    sys.exit(1)

print("\n✅ All tests passed!")






