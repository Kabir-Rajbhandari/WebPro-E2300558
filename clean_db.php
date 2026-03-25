<?php
// ---> Database cleanup and reset script with officer account initialization

require_once 'php/config.php';

echo "<div style='background: #f5f5f5; padding: 30px; border-radius: 8px;'>";
echo "<pre style='font-family: monospace; margin: 0;'>";
echo "========================================\n";
echo "  DATABASE CLEANUP & INITIALIZATION\n";
echo "========================================\n";
echo"\n";

$db = getDbConnection();

try {
    // ---> Start database transaction
    mysqli_begin_transaction($db);
    
    echo "[1/7] Deleting enrollments...\n";
    $db->query("DELETE FROM enrollments");
    
    echo "[2/7] Deleting reviews...\n";
    $db->query("DELETE FROM reviews");
    
    echo "[3/7] Deleting analytics...\n";
    $db->query("DELETE FROM analytics");
    
    echo "[4/7] Deleting documents...\n";
    $db->query("DELETE FROM documents");
    
    echo "[5/7] Deleting courses...\n";
    $db->query("DELETE FROM courses");
    
    echo "[6/7] Deleting providers...\n";
    $db->query("DELETE FROM providers");
    
    echo "[7/7] Deleting all users...\n";
    $db->query("DELETE FROM users");
    
    echo "\n<i class='fas fa-check' style='color: #4caf50;'></i> All sample data removed\n\n";
    
    // ---> Create officer account
    echo "Creating Officer Account...\n";
    
    // ---> Officer credentials set to plain text as per system requirement
    $password_plain = 'officer@123';
    
    $stmt = $db->prepare("INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)");
    $name = "Ministry Officer";
    $email = "eduskillofficer@gmail.com";
    $role = "officer";
    $phone = "0333210000";
    
    $stmt->bind_param('sssss', $name, $email, $password_plain, $role, $phone);
    if (!$stmt->execute()) {
        throw new Exception("Failed to insert officer: " . $stmt->error);
    }
    
    echo "Officer account created successfully\n";
    echo "  Name: Ministry Officer\n";
    echo "  Email: eduskillofficer@gmail.com\n";
    echo "  Password: officer@123\n";
    echo "  Role: officer\n";
    echo "  Password stored as: PLAIN TEXT\n";
    
    // ---> Commit changes to database
    mysqli_commit($db);
    
    echo "\n========================================\n";
    echo "DATABASE CLEANUP COMPLETE\n";
    echo "========================================\n";
    echo "Database Status:\n";
    echo "Users: 1 (Officer only)\n";
    echo "Providers: Empty\n";
    echo "Courses: Empty\n";
    echo "Enrollments: Empty\n";
    echo "Reviews: Empty\n";
    echo "Analytics: Empty\n\n";
    
    echo "Ready for testing!\n";
    echo "Login with:\n";
    echo "  Email: eduskillofficer@gmail.com\n";
    echo "  Password: officer@123\n";
    echo "  Role: Officer\n";
    
} catch (Exception $e) {
    // ---> Rollback on error
    mysqli_rollback($db);
    echo "✗ ERROR: " . htmlspecialchars($e->getMessage()) . "\n";
}

$db->close();

echo "</pre>";
echo "</div>";

echo "<div style='margin-top: 20px; padding: 15px; background: #e8f5e9; border-radius: 8px; border-left: 4px solid #4caf50;'>";
echo "<strong style='color: #2e7d32;'>Update Complete!</strong><br>";
echo "<small style='color: #558b2f;'>Delete this file (clean_db.php) after running for security.</small>";
echo "</div>";
?>
