package backend.repository;
import backend.model.InvetoryModel;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<InvetoryModel, Long> {
}
